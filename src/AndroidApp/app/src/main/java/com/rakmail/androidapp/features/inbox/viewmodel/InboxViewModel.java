package com.rakmail.androidapp.features.inbox.viewmodel;

import android.util.Log;

import androidx.lifecycle.LiveData;
import androidx.lifecycle.MutableLiveData;
import androidx.lifecycle.ViewModel;

import com.rakmail.androidapp.features.inbox.data.MailRepository;
import com.rakmail.androidapp.features.inbox.model.Mail;

import java.util.Collections;
import java.util.List;

/**
 * ViewModel for the Inbox screen following MVVM.
 */
public class InboxViewModel extends ViewModel {
    private static final String TAG = "InboxViewModel";

    private final MailRepository repository = new MailRepository();
    private final MutableLiveData<List<Mail>> mails = new MutableLiveData<>(Collections.emptyList());

    /**
     * LiveData of the mail list which the UI observes.
     */
    public LiveData<List<Mail>> getMails() {
        return mails;
    }

    /**
     * Fetch mails from the repository and post to LiveData.
     */
    public void fetchMails() {
        Log.d(TAG, "fetchMails() called");
        new Thread(() -> {
            try {
                List<Mail> result = repository.getMails();
                Log.d(TAG, "repository.getMails() returned " + result.size());
                mails.postValue(result);
            } catch (Exception e) {
                Log.e(TAG, "Error loading mails", e);
            }
        }).start();
    }
}
