package com.rakmail.androidapp.features.inbox.viewmodel;

import android.os.Handler;
import android.os.Looper;

import androidx.lifecycle.LiveData;
import androidx.lifecycle.MutableLiveData;
import androidx.lifecycle.ViewModel;

import com.rakmail.androidapp.features.inbox.data.MailRepository;
import com.rakmail.androidapp.features.inbox.model.Mail;
import com.rakmail.androidapp.features.label.model.Label;

import java.io.IOException;

/**
 * ViewModel for the Mail detail screen.
 */
public class MailDetailViewModel extends ViewModel {

    private final MailRepository repository = MailRepository.getInstance();
    private final MutableLiveData<Mail> mail = new MutableLiveData<>();
    private final com.rakmail.androidapp.features.label.repository.LabelRepository labelRepository = com.rakmail.androidapp.features.label.repository.LabelRepository.getInstance();
    private final MutableLiveData<Boolean> isStarred = new MutableLiveData<>(false);
    private final MutableLiveData<Boolean> isBinned = new MutableLiveData<>(false);
    private final MutableLiveData<Boolean> isSpammed = new MutableLiveData<>(false);

    public LiveData<Mail> getMail() {
        return mail;
    }

    public LiveData<Boolean> getIsStarred() {
        return isStarred;
    }

    public LiveData<Boolean> getIsBinned() {
        return isBinned;
    }

    public LiveData<Boolean> getIsSpammed() {
        return isSpammed;
    }

    private void updateStatus() {
        Mail currentMail = mail.getValue();
        if (currentMail == null) {
            isStarred.postValue(false);
            isBinned.postValue(false);
            isSpammed.postValue(false);
            return;
        }
        Label starredLabel = labelRepository.getLabelByName("Starred");
        boolean starred = starredLabel != null && starredLabel.getMailsIds() != null && starredLabel.getMailsIds().contains(currentMail.getId());
        isStarred.postValue(starred);
        Label binLabel = labelRepository.getLabelByName("Bin");
        boolean binned = binLabel != null && binLabel.getMailsIds() != null && binLabel.getMailsIds().contains(currentMail.getId());
        isBinned.postValue(binned);
        Label spamLabel = labelRepository.getLabelByName("Spam");
        boolean spammed = spamLabel != null && spamLabel.getMailsIds() != null && spamLabel.getMailsIds().contains(currentMail.getId());
        isSpammed.postValue(spammed);
    }

    public void setMail(Mail m) {
        mail.setValue(m);
        updateStatus();
    }

    public void load(String id) {
        new Thread(() -> {
            Mail m = null;
            try {
                m = repository.getMailById(id);
            } catch (IOException e) {
                throw new RuntimeException(e);
            }
            mail.postValue(m);
            updateStatus();
        }).start();
    }

    public void toggleStar() {
        Mail currentMail = mail.getValue();
        if (currentMail == null) return;
        Label starredLabel = labelRepository.getLabelByName("Starred");
        if (starredLabel == null) return;
        boolean currentlyStarred = isStarred.getValue() != null && isStarred.getValue();
        labelRepository.toggle(starredLabel.getId(), currentMail.getId(), !currentlyStarred);
        new Handler(Looper.getMainLooper()).postDelayed(this::updateStatus, 150);
    }

    public void toggleSpam() {
        Mail currentMail = mail.getValue();
        if (currentMail == null) return;
        Label spamLabel = labelRepository.getLabelByName("Spam");
        if (spamLabel == null) return;
        boolean currentlySpam = isSpammed.getValue() != null && isSpammed.getValue();
        labelRepository.toggle(spamLabel.getId(), currentMail.getId(), !currentlySpam);
        new Handler(Looper.getMainLooper()).postDelayed(this::updateStatus, 150);
    }

    /**
     * Deletes mail with bin logic: if mail is binned, delete; if not, add to bin.
     */
    public void deleteMail(Runnable onSuccess, java.util.function.Consumer<String> onError) {
        Mail currentMail = mail.getValue();
        if (currentMail == null) {
            onError.accept("Mail is null");
            return;
        }
        MailRepository.Callback callback = new MailRepository.Callback() {
            @Override
            public void onSuccess() {
                onSuccess.run();
            }

            @Override
            public void onError(String error) {
                onError.accept(error);
            }
        };
        if (isBinned.getValue() != null && isBinned.getValue()) {
            java.util.concurrent.Executors.newSingleThreadExecutor().execute(() -> {
                try {
                    repository.deleteMailById(currentMail.getId(), callback);
                    onSuccess.run();
                    updateStatus();
                } catch (Exception e) {
                    onError.accept("Failed to delete mail: " + e.getMessage());
                }
            });
        } else {
            java.util.concurrent.Executors.newSingleThreadExecutor().execute(() -> {
                try {
                    Label binLabel = labelRepository.getLabelByName("Bin");
                    labelRepository.toggle(binLabel.getId(), currentMail.getId(), true);
                    onSuccess.run();
                    updateStatus();
                } catch (Exception e) {
                    onError.accept("Failed to bin mail: " + e.getMessage());
                }
            });
        }
    }

    public boolean isBinned() {
        Boolean binned = isBinned.getValue();
        return binned != null && binned;
    }

    public boolean isStarred() {
        Boolean starred = isStarred.getValue();
        return starred != null && starred;
    }

    public boolean isSpammed() {
        Boolean spammed = isSpammed.getValue();
        return spammed != null && spammed;
    }
}
