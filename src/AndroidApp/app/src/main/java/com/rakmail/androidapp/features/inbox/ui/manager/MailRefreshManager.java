package com.rakmail.androidapp.features.inbox.ui.manager;

import android.os.Handler;
import android.os.Looper;
import android.util.Log;

import com.rakmail.androidapp.features.label.viewmodel.LabelViewModel;
import com.rakmail.androidapp.features.mail.viewmodel.MailViewModel;

public class MailRefreshManager {
    private static final String TAG = "MailRefreshManager";
    private final Handler refreshHandler;
    private final MailViewModel mailViewModel;
    private final LabelViewModel labelViewModel;
    private final long refreshIntervalMs;
    private final Runnable refreshRunnable;

    public MailRefreshManager(MailViewModel mailViewModel, LabelViewModel labelViewModel, long refreshIntervalMs) {
        this.mailViewModel = mailViewModel;
        this.labelViewModel = labelViewModel;
        this.refreshIntervalMs = refreshIntervalMs;
        this.refreshHandler = new Handler(Looper.getMainLooper());
        this.refreshRunnable = this::triggerRefresh;
    }

    public void triggerRefresh() {
        Log.d(TAG, "Triggering mail refresh.");
        mailViewModel.fetchMails();
        labelViewModel.fetchLabels();
        refreshHandler.postDelayed(refreshRunnable, refreshIntervalMs);
    }

    public void startAutoRefresh() {
        refreshHandler.removeCallbacks(refreshRunnable);
        refreshHandler.post(refreshRunnable);
    }

    public void stopAutoRefresh() {
        refreshHandler.removeCallbacks(refreshRunnable);
    }
}

