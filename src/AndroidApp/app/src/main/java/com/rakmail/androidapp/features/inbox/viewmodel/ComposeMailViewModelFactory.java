package com.rakmail.androidapp.features.inbox.viewmodel;

import android.app.Application;

import androidx.annotation.NonNull;
import androidx.lifecycle.ViewModel;
import androidx.lifecycle.ViewModelProvider;

import com.rakmail.androidapp.features.inbox.data.MailRepository;

public class ComposeMailViewModelFactory
    implements ViewModelProvider.Factory {

    private final Application app;
    private final MailRepository repo;

    public ComposeMailViewModelFactory(Application app,
                                       MailRepository repo) {
        this.app  = app;
        this.repo = repo;
    }

    @NonNull
    @Override
    @SuppressWarnings("unchecked")
    public <T extends ViewModel> T create(@NonNull Class<T> cls) {
        if (cls.isAssignableFrom(ComposeMailViewModel.class)) {
            return (T) new ComposeMailViewModel(app, repo);
        }
        throw new IllegalArgumentException("Unknown ViewModel class");
    }
}
