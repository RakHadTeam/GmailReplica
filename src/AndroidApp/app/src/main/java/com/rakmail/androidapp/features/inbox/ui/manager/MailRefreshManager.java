package com.rakmail.androidapp.features.inbox.ui.manager;

import android.os.Handler;
import android.os.Looper;
import android.util.Log;

import com.rakmail.androidapp.features.mail.viewmodel.MailViewModel;

public class MailRefreshManager {
    private static final String TAG = "MailRefreshManager";
    private final Handler refreshHandler;
    private final MailViewModel mailViewModel;
    private final long refreshIntervalMs;
    private final Runnable refreshRunnable;

    public MailRefreshManager(MailViewModel mailViewModel, long refreshIntervalMs) {
        this.mailViewModel = mailViewModel;
        this.refreshIntervalMs = refreshIntervalMs;
        this.refreshHandler = new Handler(Looper.getMainLooper());
        this.refreshRunnable = this::triggerMailRefresh;
    }

    private void triggerMailRefresh() {
        Log.d(TAG, "Triggering mail refresh.");
        mailViewModel.fetchMails();
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

