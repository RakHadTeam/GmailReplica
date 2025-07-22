package com.rakmail.androidapp.features.mail.data;

import com.rakmail.androidapp.core.api.ApiClient;
import com.rakmail.androidapp.features.mail.model.Mail;

import java.io.IOException;
import java.util.List;

import retrofit2.Call;
import retrofit2.Response;

public class MailRepository {
    private final MailApi api;
    private static volatile MailRepository INSTANCE;

    private MailRepository() {
        this.api = ApiClient.getInstance().create(MailApi.class);
    }

    public static MailRepository getInstance() {
        if (INSTANCE == null) {
            synchronized (MailRepository.class) {
                if (INSTANCE == null) {
                    INSTANCE = new MailRepository();
                }
            }
        }
        return INSTANCE;
    }

    /**
     * Synchronous fetch of all mails.
     */
    public List<Mail> fetchMailsSync() throws IOException {
        Response<List<Mail>> res = api.getMails().execute();
        if (res.isSuccessful() && res.body() != null) {
            return res.body();
        }
        throw new IOException("Failed to load mails: " + res.code());
    }

    /**
     * Synchronous fetch of a single mail by ID.
     */
    public Mail getMailById(String id) throws IOException {
        for (Mail m : fetchMailsSync()) {
            if (m.getId().equals(id)) return m;
        }
        return null;
    }

    /**
     * Asynchronous delete.
     */
    public void deleteMailById(String id, Callback cb) {
        new Thread(() -> {
            try {
                Response<Void> res = api.deleteMail(id).execute();
                if (res.isSuccessful()) {
                    cb.onSuccess();
                } else {
                    cb.onError("Delete failed: " + res.code());
                }
            } catch (IOException e) {
                cb.onError(e.getMessage());
            }
        }).start();
    }

    /**
     * Asynchronous send or save (draft).
     * If draftId==null -> POST, else PATCH.
     */
    public void sendOrSaveMail(Mail mail, String draftId, Callback cb) {
        Call<Void> call = (draftId == null)
            ? api.sendMail(mail)
            : api.updateMail(draftId, mail);

        call.enqueue(new retrofit2.Callback<Void>() {
            @Override
            public void onResponse(Call<Void> call, Response<Void> resp) {
                if (resp.isSuccessful()) {
                    cb.onSuccess();
                } else {
                    cb.onError("Error " + resp.code());
                }
            }
            @Override
            public void onFailure(Call<Void> call, Throwable t) {
                cb.onError(t.getMessage());
            }
        });
    }

    /**
     * Your own callback interface, distinct from Retrofit’s.
     */
    public interface Callback {
        void onSuccess();
        void onError(String message);
    }
}
