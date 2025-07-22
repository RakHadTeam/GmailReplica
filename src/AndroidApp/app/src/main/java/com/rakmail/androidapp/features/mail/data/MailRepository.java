package com.rakmail.androidapp.features.mail.data;

import com.rakmail.androidapp.core.api.ApiClient;
import com.rakmail.androidapp.features.mail.model.Mail;

import java.io.IOException;
import java.util.List;

import retrofit2.Response;

/**
 * Repository handling Mail data retrieval and operations from the API.
 */
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
     * Synchronously fetches mails from the server.
     *
     * @return List of Mail objects
     * @throws IOException if network or parsing fails
     */
    public List<Mail> fetchMailsSync() throws IOException {
        Response<List<Mail>> res = api.getMails().execute();
        if (res.isSuccessful() && res.body() != null) {
            return res.body();
        } else {
            throw new IOException("Failed to load mails: " + res.code());
        }
    }

    /**
     * Synchronously fetch a single mail by ID.
     *
     * @param id Mail ID
     * @return Mail object or null if not found
     * @throws IOException if network or parsing fails
     */
    public Mail getMailById(String id) throws IOException {
        for (Mail m : fetchMailsSync()) {
            if (m.getId().equals(id)) return m;
        }
        return null;
    }

    /**
     * Asynchronously delete a mail by ID.
     *
     * @param id       Mail ID
     * @param callback Callback for result
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

    /**
     * Callback for mail operations.
     */
    public interface Callback {
        void onSuccess();

        void onError(String message);
    }
}
