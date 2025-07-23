package com.rakmail.androidapp.features.compose.viewmodel;

import androidx.annotation.NonNull;
import androidx.lifecycle.ViewModel;
import androidx.lifecycle.ViewModelProvider;

public class ComposeMailViewModelFactory implements ViewModelProvider.Factory {
    @NonNull @Override
    public <T extends ViewModel> T create(@NonNull Class<T> modelClass) {
        if (modelClass.isAssignableFrom(ComposeMailViewModel.class)) {
            // no dependencies for now
            return (T) new ComposeMailViewModel();
        }
        throw new IllegalArgumentException("Unknown VM class");
    }
}
