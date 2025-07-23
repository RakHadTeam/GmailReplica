package com.rakmail.androidapp.features.inbox.ui.manager;

import android.content.Context;
import android.content.Intent;

import com.rakmail.androidapp.databinding.ActivityMainBinding;
import com.rakmail.androidapp.features.mail.viewmodel.MailViewModel;
import com.rakmail.androidapp.features.compose.ui.ComposeMailActivity;
import com.rakmail.androidapp.features.search.ui.SearchActivity;

/**
 * Encapsulates wiring up common UI actions for the inbox screen.
 */
public class UIActionsManager {
    private final ActivityMainBinding binding;
    private final MailViewModel mailViewModel;
    private final Context context;

    public UIActionsManager(
        ActivityMainBinding binding,
        MailViewModel mailViewModel,
        Context context
    ) {
        this.binding = binding;
        this.mailViewModel = mailViewModel;
        this.context = context;
    }

    /** Hook up swipe‑to‑refresh to reload mails. */
    public void setupSwipeToRefresh() {
        binding.swipeRefresh.setOnRefreshListener(mailViewModel::fetchMails);
    }

    /** Hook up the Compose button in the drawer header to open ComposeMailActivity. */
    public void setupComposeButton() {
        binding
            .btnCompose
            .setOnClickListener(v -> {
                Intent intent = new Intent(context, ComposeMailActivity.class);
                context.startActivity(intent);
            });
    }

    public void setupSearchButton() {
        binding.btnSearch.setOnClickListener(v -> {
            Intent intent = new Intent(context, SearchActivity.class);
            context.startActivity(intent);
        });
    }
}
