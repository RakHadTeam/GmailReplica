package com.rakmail.androidapp.features.inbox.data;

import com.rakmail.androidapp.core.api.ApiClient;
import com.rakmail.androidapp.features.inbox.model.Mail;

import java.io.IOException;
import java.util.List;

import retrofit2.Call;
import retrofit2.Response;

/**
 * Repository handling Mail data retrieval from the API.
 */
public class MailRepository {
    private final MailApi api;

    public MailRepository() {
        this.api = ApiClient.get().create(MailApi.class);
    }

    /**
     * Synchronously fetches mails from the server.
     * @return List of Mail objects
     * @throws IOException if network or parsing fails
     */
    public List<Mail> getMails() throws IOException {
        Response<List<Mail>> res = api.getMails().execute();
        if (res.isSuccessful() && res.body() != null) {
            return res.body();
        } else {
            throw new IOException("Failed to load mails: " + res.code());
        }
    }

    /**
     * Synchronously fetch a single mail by ID.
     */
    public Mail getMailById(String id) throws IOException {
        for (Mail m : getMails()) {
            if (m.id.equals(id)) return m;
        }
        return null;
    }

    /**
     * Asynchronously delete a mail by ID.
     */
    public void deleteMailById(String id, MailRepository.Callback callback) {
        new Thread(() -> {
            try {
                Response<Void> res = api.deleteMail(id).execute();
                if (res.isSuccessful()) {
                    callback.onSuccess();
                } else if (res.code() == 401 || res.code() == 403) {
                    callback.onError("Unauthorized");
                } else {
                    callback.onError("Failed to delete mail: " + res.code());
                }
            } catch (IOException e) {
                callback.onError("Exception: " + e.getMessage());
            }
        }).start();
    }

    public interface Callback {
        void onSuccess();
        void onError(String message);
    }
}
