package com.rakmail.androidapp.features.inbox.data;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.lifecycle.LiveData;
import androidx.lifecycle.MutableLiveData;

import com.rakmail.androidapp.core.api.ApiClient;
import com.rakmail.androidapp.features.inbox.model.Mail;
import com.rakmail.androidapp.features.inbox.model.MailPayload;
import com.rakmail.androidapp.util.Resource;

import java.io.IOException;
import java.util.List;

import retrofit2.Call;
import retrofit2.Response;

/**
 * Repository handling Mail data retrieval from the API.
 */
public class MailRepository {
    private final MailApi api;
    private static volatile MailRepository INSTANCE;

    private MailRepository() {
        this.api = ApiClient.get().create(MailApi.class);
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
            if (m.getId().equals(id)) return m;
        }
        return null;
    }

    /**
     * Asynchronously delete a mail by ID.
     */
    public void deleteMailById(String id, DeleteCallback callback) {
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
     * Asynchronously send or save (draft) a mail, exposed as LiveData.
     */
    public LiveData<Resource<Void>> sendOrSaveMail(
        @Nullable String draftId,
        @NonNull MailPayload payload) {

        MutableLiveData<Resource<Void>> live = new MutableLiveData<>();
        live.setValue(Resource.loading());

        Call<Void> call = (draftId == null)
            ? api.sendMail(payload)
            : api.updateMail(draftId, payload);

        // fully qualify retrofit2.Callback to avoid conflict with DeleteCallback
        call.enqueue(new retrofit2.Callback<Void>() {
            @Override
            public void onResponse(
                @NonNull Call<Void> c,
                @NonNull Response<Void> r) {
                int code = r.code();
                if (code == 201 || code == 204) {
                    live.postValue(Resource.success(null));
                } else if (code == 401 || code == 403) {
                    live.postValue(Resource.error("AUTH"));
                } else {
                    live.postValue(Resource.error("Save failed (" + code + ")"));
                }
            }
            @Override
            public void onFailure(
                @NonNull Call<Void> c,
                @NonNull Throwable t) {
                live.postValue(Resource.error(t.getMessage()));
            }
        });

        return live;
    }

    /** Callback for the async deleteMailById(...) */
    public interface DeleteCallback {
        void onSuccess();
        void onError(String message);
    }
}
