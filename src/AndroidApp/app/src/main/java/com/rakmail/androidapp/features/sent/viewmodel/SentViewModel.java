package com.rakmail.androidapp.features.sent.viewmodel;

import androidx.lifecycle.LiveData;
import androidx.lifecycle.MutableLiveData;
import androidx.lifecycle.ViewModel;
import com.rakmail.androidapp.core.preferences.AuthPreferences;
import com.rakmail.androidapp.features.inbox.model.Mail;
import com.rakmail.androidapp.features.inbox.data.MailRepository;
import java.util.ArrayList;
import java.util.List;

public class SentViewModel extends ViewModel {
    private final MutableLiveData<List<Mail>> sent = new MutableLiveData<>(new ArrayList<>());
    private final MailRepository repo = new MailRepository();
    private final String myId = AuthPreferences.getInstance().getUserId();

    public LiveData<List<Mail>> getMails() { return sent; }

    public void fetchSent() {
        new Thread(() -> {
            try {
                List<Mail> all = repo.getMails();
                List<Mail> mine = new ArrayList<>();
                for (Mail m : all)
                    if (!m.draft && myId.equals(m.senderId))
                        mine.add(m);
                sent.postValue(mine);
            } catch (Exception ignored) { }
        }).start();
    }
}
