package com.rakmail.androidapp.features.inbox.viewmodel;

import androidx.lifecycle.LiveData;
import androidx.lifecycle.MutableLiveData;
import androidx.lifecycle.ViewModel;

import com.rakmail.androidapp.features.mail.data.MailRepository;
import com.rakmail.androidapp.features.mail.model.Mail;
import com.rakmail.androidapp.features.label.data.LabelRepository;

import java.io.IOException;

/**
 * ViewModel for the Mail detail screen.
 */
public class MailDetailViewModel extends ViewModel {

    private final MailRepository repository = MailRepository.getInstance();
    private final MutableLiveData<Mail> mail = new MutableLiveData<>();
    private final LabelRepository labelRepository = LabelRepository.getInstance();

    public LiveData<Mail> getMail() {
        return mail;
    }


    public void setMail(Mail m) {
        mail.setValue(m);
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
        }).start();
    }
}
