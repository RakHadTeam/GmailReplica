package com.rakmail.androidapp.features.mail.viewmodel;

import android.util.Log;

import androidx.lifecycle.LiveData;
import androidx.lifecycle.MutableLiveData;
import com.rakmail.androidapp.features.mail.model.Mail;
import com.rakmail.androidapp.features.mail.data.MailRepository;
import com.rakmail.androidapp.features.user.data.UserRepository;
import com.rakmail.androidapp.features.user.model.User;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

/**
 * ViewModel for managing mail data and operations.
 */
public class MailViewModel extends androidx.lifecycle.ViewModel {
    private final UserRepository userRepository = UserRepository.getInstance();
    private final MailRepository mailRepository = MailRepository.getInstance();
    private final MutableLiveData<List<Mail>> mails = new MutableLiveData<>(Collections.emptyList());
    private final ExecutorService executorService = Executors.newSingleThreadExecutor();

    public MailViewModel() {
        setMails(Collections.emptyList());
    }

    public LiveData<List<Mail>> getMails() {
        return mails;
    }

    public void setMails(List<Mail> mailList) {
        mails.postValue(mailList);
    }

    /**
     * Fetches mails from the repository and enriches them with sender info.
     */
    public void fetchMails() {
        executorService.execute(() -> {
            try {
                List<Mail> rawMails = mailRepository.fetchMailsSync();
                List<Mail> enrichedMails = enrichMailList(rawMails);
                setMails(enrichedMails);
            } catch (IOException e) {
                Log.d("MailViewModel", "Error fetching mails: " + e.getMessage());
            }
        });
    }

    /**
     * Enriches mail list with sender information if missing.
     */
    private List<Mail> enrichMailList(List<Mail> mailsToEnrich) {
        if (mailsToEnrich.isEmpty()) return Collections.emptyList();
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
                        latch.countDown();
                    }
                    @Override
                    public void onFailure(String msg) {
                        latch.countDown();
                    }
                });
            } else {
                latch.countDown();
            }
        }
        try {
            latch.await();
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
        return new ArrayList<>(resultList);
    }

    /**
     * Deletes a mail by ID and updates the LiveData list.
     */
    public void deleteMailById(String mailId) {
        mailRepository.deleteMailById(mailId, new MailRepository.Callback() {
            @Override
            public void onSuccess() {
                Log.d("MailViewModel", "Mail deleted successfully: " + mailId);
                List<Mail> currentMails = mails.getValue();
                if (currentMails != null) {
                    List<Mail> updatedMails = new ArrayList<>(currentMails);
                    updatedMails.removeIf(mail -> mail.getId().equals(mailId));
                    setMails(updatedMails);
                }
            }

            @Override
            public void onError(String error) {
                Log.e("MailViewModel", "Failed to delete mail: " + error);
            }
        });
    }

    @Override
    protected void onCleared() {
        super.onCleared();
        executorService.shutdownNow();
    }
}
