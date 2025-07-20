package com.rakmail.androidapp.features.inbox.ui.manager;

import android.content.Context;
import android.widget.Toast;

import com.rakmail.androidapp.databinding.ActivityMainBinding;
import com.rakmail.androidapp.features.inbox.viewmodel.InboxViewModel;

public class UIActionsManager {
    private final ActivityMainBinding binding;
    private final InboxViewModel inboxViewModel;
    private final Context context;

    public UIActionsManager(ActivityMainBinding binding, InboxViewModel inboxViewModel, Context context) {
        this.binding = binding;
        this.inboxViewModel = inboxViewModel;
        this.context = context;
    }

    public void setupSwipeToRefresh() {
        binding.swipeRefresh.setOnRefreshListener(() -> {
            inboxViewModel.fetchMails();
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

