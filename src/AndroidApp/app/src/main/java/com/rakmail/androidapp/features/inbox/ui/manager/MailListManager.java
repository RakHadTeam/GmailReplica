package com.rakmail.androidapp.features.inbox.ui.manager;

import android.content.Context;

import androidx.recyclerview.widget.LinearLayoutManager;

import com.rakmail.androidapp.databinding.ActivityMainBinding;
import com.rakmail.androidapp.features.inbox.ui.adapter.MailAdapter;
import com.rakmail.androidapp.features.inbox.viewmodel.InboxViewModel;

import java.util.Set;

public class MailListManager {
    private final MailAdapter adapter;
    private final ActivityMainBinding binding;
    private final InboxViewModel inboxViewModel;
    private final Context context;
    private OnMailSelectionChangeListener selectionChangeListener;

    public MailListManager(ActivityMainBinding binding, InboxViewModel inboxViewModel, Context context) {
        this.binding = binding;
        this.inboxViewModel = inboxViewModel;
        this.context = context;
        this.adapter = new MailAdapter();
        setupRecyclerView();
    }

    public void setOnMailSelectionChangeListener(OnMailSelectionChangeListener listener) {
        this.selectionChangeListener = listener;
    }

    private void setupRecyclerView() {
        binding.recyclerMails.setLayoutManager(new LinearLayoutManager(context));
        binding.recyclerMails.setAdapter(adapter);
        adapter.setOnSelectionChangeListener(selectedIds -> {
            if (selectionChangeListener != null) {
                selectionChangeListener.onSelectionChanged(selectedIds);
            }
        });
    }

    /**
     * Call this when switching current label to clear all mail selections
     */
    public void onCurrentLabelChanged() {
        adapter.onNavigationChanged();
    }

    public MailAdapter getAdapter() {
        return adapter;
    }

    public interface OnMailSelectionChangeListener {
        void onSelectionChanged(Set<String> selectedIds);
    }
}
