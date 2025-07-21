package com.rakmail.androidapp.features.inbox.viewmodel;

import android.util.Log;

import androidx.lifecycle.LiveData;
import androidx.lifecycle.MutableLiveData;
import androidx.lifecycle.ViewModel;

import com.rakmail.androidapp.features.mail.model.Mail;
import com.rakmail.androidapp.features.label.model.Label;
import com.rakmail.androidapp.features.label.data.LabelRepository;
import com.rakmail.androidapp.features.label.viewmodel.LabelViewModel;
import com.rakmail.androidapp.features.mail.viewmodel.MailViewModel;

import java.util.Collections;
import java.util.List;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.stream.Collectors;

public class InboxViewModel extends ViewModel {
    private static final String TAG = "InboxViewModel";

    private MailViewModel mailViewModel;
    private final LabelRepository labelRepository = LabelRepository.getInstance();
    private final MutableLiveData<List<Mail>> visibleMails = new MutableLiveData<>(Collections.emptyList());
    private final MutableLiveData<Boolean> isLoading = new MutableLiveData<>(false);
    private final MutableLiveData<String> errorMessage = new MutableLiveData<>();
    private final ExecutorService executorService = Executors.newSingleThreadExecutor();
    private String currentLabelId = "";

    public void setMailViewModel(MailViewModel mailViewModel) {
        this.mailViewModel = mailViewModel;
        if (mailViewModel != null) {
            mailViewModel.getMails().observeForever(mails -> filterMails());
        }
    }

    public LiveData<List<Mail>> getVisibleMails() {
        return visibleMails;
    }

    public LiveData<Boolean> getIsLoading() {
        return isLoading;
    }

    public LiveData<String> getErrorMessage() {
        return errorMessage;
    }

    private boolean isExcludedFromAll(Mail mail) {
        String id = mail.getId();
        Label binLabel = labelRepository.getLabelByName("Bin");
        List<String> binIds = (binLabel != null && binLabel.getMailIds() != null) ? binLabel.getMailIds() : Collections.emptyList();
        Label spamLabel = labelRepository.getLabelByName("Spam");
        List<String> spamIds = (spamLabel != null && spamLabel.getMailIds() != null) ? spamLabel.getMailIds() : Collections.emptyList();
        Label sentLabel = labelRepository.getLabelByName("Sent");
        List<String> sentIds = (sentLabel != null && sentLabel.getMailIds() != null) ? sentLabel.getMailIds() : Collections.emptyList();
        if (binIds.contains(id)) return true;
        if (spamIds.contains(id)) return true;
        if (sentIds.contains(id) && (mail.getRecipientId() == null || !mail.getRecipientId().equals(mail.getSenderId())))
            return true;
        return mail.isDraft();
    }

    public void setCurrentLabelId(String labelId) {
        Log.d(TAG, "setCurrentLabelId() called with: labelId = [" + labelId + "]");
        this.currentLabelId = labelId;
        filterMails();
    }

    public String getCurrentLabelId() {
        return currentLabelId;
    }

    private void filterMails() {
        try {
            List<Mail> rawMails = mailViewModel.getMails().getValue();
            if (rawMails == null) rawMails = Collections.emptyList();
            List<String> binIds = Collections.emptyList();
            Label binLabel = labelRepository.getLabelByName("Bin");
            if (binLabel != null && binLabel.getMailIds() != null) binIds = binLabel.getMailIds();
            final List<String> finalBinIds = binIds;
            Label labelObj = labelRepository.getLabelById(currentLabelId);
            if (currentLabelId == "") {
                visibleMails.postValue(rawMails);
                Log.d(TAG, "filterMails: currentLabelId is not empty, returning all mails");
                return;
            }

            for ( String mailId : labelObj.getMailIds()) {
                Log.d(TAG, "filterMails: mailId in labelObj: " + mailId);
            }

            List<Mail> filteredMails = rawMails.stream()
                .filter(mail -> {
                    String mailId = mail.getId();
                    if (currentLabelId.isEmpty()) return !isExcludedFromAll(mail);
                    List<String> labelMailIds = (labelObj != null && labelObj.getMailIds() != null) ? labelObj.getMailIds() : Collections.emptyList();
                    if (labelObj == binLabel)
                        return finalBinIds.contains(mailId);
                    if (labelObj != null)
                        return labelMailIds.contains(mailId) && !finalBinIds.contains(mailId);
                    else if ("Drafts".equals(currentLabelId))
                        return mail.isDraft() && !finalBinIds.contains(mailId);
                    return false;
                })
                .collect(Collectors.toList());
            visibleMails.postValue(filteredMails);
        } catch (Exception e) {
            Log.e(TAG, "Error filtering mails", e);
            errorMessage.postValue("Failed to filter mails: " + e.getMessage());
        }
    }

    public void observeLabelChanges(LabelViewModel labelViewModel) {
        labelViewModel.getLabelChangedEvent().observeForever(changed -> {
            if (Boolean.TRUE.equals(changed)) {
                filterMails();
                labelViewModel.resetLabelChangedEvent();
            }
        });
    }

    @Override
    protected void onCleared() {
        super.onCleared();
        Log.d(TAG, "onCleared() called, shutting down executor service.");
        executorService.shutdownNow();
    }
}
