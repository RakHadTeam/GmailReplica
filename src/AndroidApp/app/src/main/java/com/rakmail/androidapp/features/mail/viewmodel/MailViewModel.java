package com.rakmail.androidapp.features.mail.viewmodel;

import android.util.Log;

import androidx.lifecycle.LiveData;
import androidx.lifecycle.MutableLiveData;
import androidx.lifecycle.ViewModel;

import com.rakmail.androidapp.features.mail.data.MailRepository;
import com.rakmail.androidapp.features.mail.model.Mail;
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
public class MailViewModel extends ViewModel {
    private final UserRepository userRepository = UserRepository.getInstance();
    private final MailRepository mailRepository = MailRepository.getInstance();
    private final MutableLiveData<List<Mail>> mails =
        new MutableLiveData<>(Collections.emptyList());
    private final ExecutorService executorService =
        Executors.newSingleThreadExecutor();

    public MailViewModel() {
        setMails(Collections.emptyList());
    }

    public LiveData<List<Mail>> getMails() {
        return mails;
    }

    private void setMails(List<Mail> mailList) {
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
                Log.e("MailViewModel", "Error fetching mails", e);
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
            if (!mail.isDraft() &&
                (mail.getSenderEmail() == null || mail.getSenderEmail().isEmpty())) {

                userRepository.getUserById(mail.getSenderId(),
                    new UserRepository.GetUserCallback() {
                        @Override
                        public void onSuccess(User sender) {
                            Mail m = resultList.get(index);
                            m.setSenderName(sender.getFullname());
                            m.setSenderEmail(sender.getEmail());
                            m.setSenderPicture(sender.getPicture());
                            latch.countDown();
                        }

                        @Override
                        public void onFailure(String msg) {
                            latch.countDown();
                        }
                    }
                );
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
                Log.d("MailViewModel", "Mail deleted: " + mailId);
                List<Mail> current = mails.getValue();
                if (current != null) {
                    List<Mail> updated = new ArrayList<>(current);
                    updated.removeIf(m -> m.getId().equals(mailId));
                    setMails(updated);
                }
            }

            @Override
            public void onError(String error) {
                Log.e("MailViewModel", "Delete failed: " + error);
            }
        });
    }

    @Override
    protected void onCleared() {
        super.onCleared();
        executorService.shutdownNow();
    }

    public List<Mail> searchMails(String query) {
        try {
            List<Mail> rawMails =  mailRepository.searchMailsSync(query);
            return enrichMailList(rawMails);
        } catch (Exception e) {
            e.printStackTrace();
            return java.util.Collections.emptyList();
        }
    }
}
