package com.rakmail.androidapp.features.inbox.ui.manager;

import android.content.Context;
import android.widget.Toast;

import com.rakmail.androidapp.databinding.ActivityMainBinding;
import com.rakmail.androidapp.features.mail.viewmodel.MailViewModel;

public class UIActionsManager {
    private final ActivityMainBinding binding;
    private final MailViewModel mailViewModel;
    private final Context context;

    public UIActionsManager(ActivityMainBinding binding, MailViewModel mailViewModel, Context context) {
        this.binding = binding;
        this.mailViewModel = mailViewModel;
        this.context = context;
    }

    public void setupSwipeToRefresh() {
        binding.swipeRefresh.setOnRefreshListener(() -> {
            mailViewModel.fetchMails();
        });
    }

    public void setupComposeButton() {
        binding.navView.getHeaderView(0).findViewById(com.rakmail.androidapp.R.id.btnCompose)
            .setOnClickListener(v -> {
                Toast.makeText(context, "Compose mail clicked (TODO)", Toast.LENGTH_SHORT).show();
                // TODO: open Compose activity / fragment
            });
    }
}

