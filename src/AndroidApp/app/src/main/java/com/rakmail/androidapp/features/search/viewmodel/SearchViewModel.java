package com.rakmail.androidapp.features.search.viewmodel;

import androidx.lifecycle.LiveData;
import androidx.lifecycle.MutableLiveData;
import androidx.lifecycle.ViewModel;
import androidx.lifecycle.ViewModelProvider;

import com.rakmail.androidapp.features.mail.data.MailRepository;
import com.rakmail.androidapp.features.mail.model.Mail;
import com.rakmail.androidapp.features.mail.viewmodel.MailViewModel;

import java.util.Collections;
import java.util.List;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

public class SearchViewModel extends ViewModel {
    private final MutableLiveData<List<Mail>> searchResults = new MutableLiveData<>(Collections.emptyList());
    private final MutableLiveData<String> errorMessage = new MutableLiveData<>();
    private final ExecutorService executorService = Executors.newSingleThreadExecutor();

    private MailViewModel mailViewModel;


    public void setMailViewModel(MailViewModel mailViewModel) {
        this.mailViewModel = mailViewModel;
    }

    public LiveData<List<Mail>> getSearchResults() {
        return searchResults;
    }

    public LiveData<String> getErrorMessage() {
        return errorMessage;
    }

    public void searchMails(String query) {
        executorService.execute(() -> {
            try {

                List<Mail> mails = mailViewModel.searchMails(query);
                searchResults.postValue(mails);
            } catch (Exception e) {
                errorMessage.postValue(e.getMessage());
            }
        });
    }

    @Override
    protected void onCleared() {
        super.onCleared();
        executorService.shutdownNow();
    }
}

