package com.rakmail.androidapp.features.inbox.viewmodel;

import android.app.Application;
import android.text.TextUtils;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.lifecycle.AndroidViewModel;
import androidx.lifecycle.LiveData;
import androidx.lifecycle.MutableLiveData;

import com.rakmail.androidapp.features.inbox.data.MailRepository;
import com.rakmail.androidapp.features.inbox.model.MailPayload;
import com.rakmail.androidapp.util.Resource;

public class ComposeMailViewModel extends AndroidViewModel {

    private final MailRepository repo;
    private final MutableLiveData<Resource<Void>> result = new MutableLiveData<>();

    public ComposeMailViewModel(@NonNull Application app,
                                @NonNull MailRepository repository) {
        super(app);
        this.repo = repository;
    }

    public LiveData<Resource<Void>> getResult() {
        return result;
    }

    public void sendOrSave(@Nullable String draftId,
                           @Nullable String recipient,
                           @Nullable String subject,
                           @Nullable String body,
                           boolean draft) {

        // same basic validation rules as the React hook
        if (!draft && TextUtils.isEmpty(recipient)) {
            result.setValue(Resource.error("Recipient is required."));
            return;
        }
        if (!draft && TextUtils.isEmpty(subject)) {
            result.setValue(Resource.error("Subject is required."));
            return;
        }
        if (!draft && TextUtils.isEmpty(body)) {
            result.setValue(Resource.error("Body is required."));
            return;
        }

        MailPayload payload =
            new MailPayload(recipient, subject, body, draft);

        repo.sendOrSaveMail(draftId, payload)
            .observeForever(result::postValue);
    }
}
