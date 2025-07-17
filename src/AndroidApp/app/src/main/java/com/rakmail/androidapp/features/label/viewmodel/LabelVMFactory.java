package com.rakmail.androidapp.features.label.viewmodel;

import androidx.annotation.NonNull;
import androidx.lifecycle.ViewModel;
import androidx.lifecycle.ViewModelProvider;

import com.rakmail.androidapp.features.label.repository.LabelRepository;

public class LabelVMFactory implements ViewModelProvider.Factory {
    private final LabelRepository repo;
    public LabelVMFactory(LabelRepository repo) { this.repo = repo; }
    @NonNull
    @Override
    public <T extends ViewModel> T create(@NonNull Class<T> modelClass) {
        //noinspection unchecked
        return (T) new LabelViewModel(repo);
    }
}
