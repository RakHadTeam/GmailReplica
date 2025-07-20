package com.rakmail.androidapp.features.inbox.viewmodel;

import android.util.Log;

import androidx.lifecycle.LiveData;
import androidx.lifecycle.MutableLiveData;
import androidx.lifecycle.ViewModel;

import com.rakmail.androidapp.features.inbox.data.MailRepository;
import com.rakmail.androidapp.features.inbox.model.Mail;
import com.rakmail.androidapp.features.label.model.Label;
import com.rakmail.androidapp.features.label.repository.LabelRepository;
import com.rakmail.androidapp.features.user.data.repository.UserRepository;
import com.rakmail.androidapp.features.user.model.User;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.stream.Collectors;

/**
 * ViewModel for managing inbox mails and labels.
 * Handles mail fetching, deletion, and error/loading state.
 */
public class InboxViewModel extends ViewModel {
    private static final String TAG = "InboxViewModel";

    private final MailRepository mailRepository;
    private final LabelRepository labelRepository;
    private final UserRepository userRepository;
    private final MutableLiveData<List<Mail>> mails = new MutableLiveData<>(Collections.emptyList());
    private final MutableLiveData<List<Mail>> visibleMails = new MutableLiveData<>(Collections.emptyList());
    private final MutableLiveData<Boolean> isLoading = new MutableLiveData<>(false);
    private final MutableLiveData<String> errorMessage = new MutableLiveData<>();
    // Use a single-threaded executor for network operations
    private final ExecutorService executorService = Executors.newSingleThreadExecutor();
    private String currentLabelId = "";
    private volatile boolean isFetchPending = false;

    /**
     * Constructor for dependency injection.
     * Pass LabelViewModel to access shared labels LiveData
     */
    public InboxViewModel(MailRepository mailRepository, LabelRepository labelRepository, UserRepository userRepository) {
        this.mailRepository = mailRepository;
        this.labelRepository = labelRepository;
        this.userRepository = userRepository;
        fetchMails(); // Fetch mails at startup
        // Observe mails LiveData and filter whenever mails change
        this.mails.observeForever(mails -> filterMails());
    }

    /**
     * @return LiveData list of mails for UI observation.
     */
    public LiveData<List<Mail>> getMails() {
        return mails;
    }

    /**
     * @return LiveData list of visible mails for UI observation.
     */
    public LiveData<List<Mail>> getVisibleMails() {
        return visibleMails;
    }

    /**
     * @return LiveData for loading state.
     */
    public LiveData<Boolean> getIsLoading() {
        return isLoading;
    }

    /**
     * @return LiveData for error messages.
     */
    public LiveData<String> getErrorMessage() {
        return errorMessage;
    }

    private boolean isExcludedFromAll(Mail mail) {
        String id = mail.getId();
        Label binLabel = labelRepository.getLabelByName("Bin");
        List<String> binIds = (binLabel != null) ? binLabel.getMailsIds() : Collections.emptyList();
        Label spamLabel = labelRepository.getLabelByName("Spam");
        List<String> spamIds = (spamLabel != null) ? spamLabel.getMailsIds() : Collections.emptyList();
        Label sentLabel = labelRepository.getLabelByName("Sent");
        List<String> sentIds = (sentLabel != null) ? sentLabel.getMailsIds() : Collections.emptyList();
        if (binIds.contains(id)) return true;
        if (spamIds.contains(id)) return true;
        if (sentIds.contains(id) && (mail.getRecipientId() == null || !mail.getRecipientId().equals(mail.getSenderId())))
            return true;
        return mail.isDraft();
    }

    /**
     * Sets the current label and refreshes mails.
     *
     * @param labelId Label id
     */
    public void setCurrentLabelId(String labelId) {
        Log.d(TAG, "setCurrentLabelId() called with: labelId = [" + labelId + "]");
        this.currentLabelId = labelId;
        filterMails();
    }

    public String getCurrentLabelId() {
        return currentLabelId;
    }

    /**
     * Debounced fetch mails to avoid excessive refreshes.
     * Fetches mails from repository and updates LiveData.
     */
    public void fetchMails() {
        if (isFetchPending) return;
        isFetchPending = true;
        executorService.execute(() -> {
            try {
                isLoading.postValue(true);
                labelRepository.refresh();
                // Only fetch mails, don't filter here
                List<Mail> rawMails = mailRepository.getMails();
                // Enrich mails with sender details
                List<Mail> enrichedMails = enrichMailList(rawMails);
                mails.postValue(enrichedMails);
                Log.d(TAG, "Fetched " + rawMails.size() + " raw mails.");
            } catch (Exception e) {
                Log.e(TAG, "Error loading or enriching mails", e);
                errorMessage.postValue("Failed to load emails: " + e.getMessage());
            } finally {
                isLoading.postValue(false);
                isFetchPending = false;
            }
        });
    }

    private void filterMails() {
        try {
            List<Mail> rawMails = mails.getValue(); // Use LiveData value
            if (rawMails == null) rawMails = Collections.emptyList();
            List<String> binIds = Collections.emptyList();
            Label binLabel = labelRepository.getLabelByName("Bin");
            if (binLabel != null) binIds = binLabel.getMailsIds();
            final List<String> finalBinIds = binIds;
            List<Mail> filteredMails = rawMails.stream()
                .filter(mail -> {
                    String mailId = mail.getId();
                    if (currentLabelId.isEmpty()) return !isExcludedFromAll(mail);
                    Label labelObj = labelRepository.getLabelById(currentLabelId);
                    if (labelObj == binLabel)
                        return finalBinIds.contains(mailId);
                    if (labelObj != null)
                        return labelObj.getMailsIds().contains(mailId) && !finalBinIds.contains(mailId);
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

    /**
     * Enriches a list of mails by fetching sender details if necessary.
     * Blocks until all enrichment tasks are complete.
     *
     * @param mailsToEnrich List of mails to enrich
     * @return List of enriched mails
     */
    private List<Mail> enrichMailList(List<Mail> mailsToEnrich) {
        if (mailsToEnrich.isEmpty()) return Collections.emptyList();
        Log.d(TAG, "Starting enrichment for " + mailsToEnrich.size() + " mails.");
        List<Mail> resultList = Collections.synchronizedList(new ArrayList<>(mailsToEnrich));
        CountDownLatch latch = new CountDownLatch(mailsToEnrich.size());
        for (int i = 0; i < mailsToEnrich.size(); i++) {
            final Mail mail = mailsToEnrich.get(i);
            final int index = i;
            if (!mail.isDraft() && (mail.getSenderEmail() == null || mail.getSenderEmail().isEmpty())) {
                userRepository.getUserById(mail.getSenderId(), new UserRepository.GetUserCallback() {
                    @Override
                    public void onSuccess(User sender) {
                        Mail mailToUpdate = resultList.get(index);
                        mailToUpdate.setSenderName(sender.getFullname());
                        mailToUpdate.setSenderEmail(sender.getEmail());
                        mailToUpdate.setSenderPicture(sender.getPicture());
                        Log.d(TAG, "Enriched mail ID: " + mail.getId() + " with sender: " + sender.getEmail());
                        latch.countDown();
                    }

                    @Override
                    public void onFailure(String msg) {
                        Log.e(TAG, "Failed to fetch sender for mail ID: " + mail.getId() + " - " + msg);
                        latch.countDown();
                    }
                });
            } else {
                latch.countDown();
            }
        }
        try {
            Log.d(TAG, "Waiting for enrichment latch (" + mailsToEnrich.size() + ")...");
            latch.await();
            Log.d(TAG, "Enrichment latch released.");
        } catch (InterruptedException e) {
            Log.e(TAG, "Enrichment process interrupted", e);
            Thread.currentThread().interrupt();
            errorMessage.postValue("Mail enrichment was interrupted.");
        }
        return new ArrayList<>(resultList);
    }

    /**
     * Deletes a mail by its ID and refreshes the mail list upon success.
     * Posts error message to LiveData if deletion fails.
     *
     * @param mailId Mail ID to delete
     */
    public void deleteMailById(String mailId) {
        isLoading.postValue(true);
        mailRepository.deleteMailById(mailId, new MailRepository.Callback() {
            @Override
            public void onSuccess() {
                errorMessage.postValue("");
                fetchMails();
            }

            @Override
            public void onError(String message) {
                errorMessage.postValue(message != null ? message : "Unknown error deleting mail");
                isLoading.postValue(false);
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
