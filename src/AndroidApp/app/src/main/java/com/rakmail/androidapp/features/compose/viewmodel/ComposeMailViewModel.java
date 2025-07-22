package com.rakmail.androidapp.features.compose.viewmodel;

import androidx.lifecycle.LiveData;
import androidx.lifecycle.MutableLiveData;
import androidx.lifecycle.ViewModel;

import com.rakmail.androidapp.features.mail.data.MailRepository;
import com.rakmail.androidapp.features.mail.model.Mail;
import com.rakmail.androidapp.core.util.Resource;

public class ComposeMailViewModel extends ViewModel {
    private final MailRepository repo = MailRepository.getInstance();
    private final MutableLiveData<Resource<Void>> result = new MutableLiveData<>();
    private String draftId;

    /** If editing an existing draft, set its ID here */
    public void setDraftId(String id) {
        this.draftId = id;
    }

    /** Observed by the Activity to show loading / success / error states */
    public LiveData<Resource<Void>> getResult() {
        return result;
    }

    /**
     * Called when user taps Send or Save‑Draft.
     * mail.isDraft() indicates whether this is a draft or a real send.
     */
    public void sendOrSave(Mail mail) {
        result.setValue(Resource.loading());
        repo.sendOrSaveMail(mail, draftId, new MailRepository.Callback() {
            @Override
            public void onSuccess() {
                result.postValue(Resource.success(null));
            }

            @Override
            public void onError(String message) {
                result.postValue(Resource.error(message));
            }
        });
    }

    /** Called when user taps Delete on a draft */
    public void deleteDraft() {
        if (draftId != null) {
            result.setValue(Resource.loading());
            repo.deleteMailById(draftId, new MailRepository.Callback() {
                @Override
                public void onSuccess() {
                    result.postValue(Resource.success(null));
                }

                @Override
                public void onError(String message) {
                    result.postValue(Resource.error(message));
                }
            });
        }
    }
}
