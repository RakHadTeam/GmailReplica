package com.rakmail.androidapp.features.inbox.viewmodel;

import androidx.annotation.NonNull;
import androidx.lifecycle.ViewModel;
import androidx.lifecycle.ViewModelProvider;

import com.rakmail.androidapp.features.inbox.data.MailRepository;
import com.rakmail.androidapp.features.label.repository.LabelRepository;
import com.rakmail.androidapp.features.user.data.UserRepository;

/**
 * Factory for InboxViewModel to inject repositories.
 */
public class InboxViewModelFactory implements ViewModelProvider.Factory {
    private final MailRepository mailRepository;
    private final LabelRepository labelRepository;
    private final UserRepository userRepository;

    public InboxViewModelFactory(MailRepository mailRepository, LabelRepository labelRepository, UserRepository userRepository) {
        this.mailRepository = mailRepository;
        this.labelRepository = labelRepository;
        this.userRepository = userRepository;
    }

    @NonNull
    @Override
    public <T extends ViewModel> T create(@NonNull Class<T> modelClass) {
        if (modelClass.isAssignableFrom(InboxViewModel.class)) {
            return (T) new InboxViewModel(mailRepository, labelRepository, userRepository);
        }
        throw new IllegalArgumentException("Unknown ViewModel class");
    }
}

