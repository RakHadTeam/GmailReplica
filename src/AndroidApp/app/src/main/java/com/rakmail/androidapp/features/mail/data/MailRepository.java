package com.rakmail.androidapp.features.mail.data;

import com.rakmail.androidapp.core.api.ApiClient;
import com.rakmail.androidapp.core.api.StatusCode;
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
        String errorMsg = null;
        try {
            if (res.errorBody() != null) {
                String errorString = res.errorBody().string();
                org.json.JSONObject errorJson = new org.json.JSONObject(errorString);
                errorMsg = errorJson.optString("error", "Failed to load mails: " + res.code());
            }
        } catch (Exception e) {
            errorMsg = "Failed to load mails: " + res.code();
        }
        throw new IOException(errorMsg);
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
                    String errorMsg = null;
                    try {
                        if (res.errorBody() != null) {
                            String errorString = res.errorBody().string();
                            org.json.JSONObject errorJson = new org.json.JSONObject(errorString);
                            errorMsg = errorJson.optString("error", "Delete failed: " + res.code());
                        }
                    } catch (Exception e) {
                        errorMsg = "Delete failed: " + res.code();
                    }
                    cb.onError(errorMsg);
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
                    String errorMsg = null;
                    try {
                        if (resp.errorBody() != null) {
                            String errorString = resp.errorBody().string();
                            org.json.JSONObject errorJson = new org.json.JSONObject(errorString);
                            errorMsg = errorJson.optString("error", "Send/Save failed: " + resp.code());
                        }
                    } catch (Exception e) {
                        errorMsg = "Send/Save failed: " + resp.code();
                    }
                    cb.onError(errorMsg);
                }
            }
            @Override
            public void onFailure(Call<Void> call, Throwable t) {
                cb.onError(t.getMessage());
            }
        });
    }

    public List<Mail> searchMailsSync(String query) {
        Response<List<Mail>> res = null;
        try {
            res = api.searchMails(query != "" ? query : "/").execute();
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
        if (res.isSuccessful() && res.body() != null) {
            List<Mail> mails = res.body();
            return mails;
        }
        return List.of(); // Return empty list on failure
    }

    /**
     * Your own callback interface, distinct from Retrofit’s.
     */
    public interface Callback {
        void onSuccess();
        void onError(String message);
    }
}
