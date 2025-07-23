package com.rakmail.androidapp.features.inbox.ui.manager;

import android.content.Context;

import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.viewbinding.ViewBinding;

import com.rakmail.androidapp.features.inbox.ui.adapter.MailAdapter;

import java.util.Set;

public class MailListManager {
    private final MailAdapter adapter;
    private final ViewBinding binding;
    private final Context context;
    private OnMailSelectionChangeListener selectionChangeListener;

    public MailListManager(ViewBinding binding, Context context) {
        this.binding = binding;
        this.context = context;
        this.adapter = new MailAdapter();
        setupRecyclerView();
    }

    public void setOnMailSelectionChangeListener(OnMailSelectionChangeListener listener) {
        this.selectionChangeListener = listener;
    }

    private void setupRecyclerView() {
        if (binding instanceof com.rakmail.androidapp.databinding.ActivityMainBinding) {
            ((com.rakmail.androidapp.databinding.ActivityMainBinding) binding).recyclerMails.setLayoutManager(new LinearLayoutManager(context));
            ((com.rakmail.androidapp.databinding.ActivityMainBinding) binding).recyclerMails.setAdapter(adapter);
        } else if (binding instanceof com.rakmail.androidapp.databinding.ActivitySearchBinding) {
            ((com.rakmail.androidapp.databinding.ActivitySearchBinding) binding).recyclerMails.setLayoutManager(new LinearLayoutManager(context));
            ((com.rakmail.androidapp.databinding.ActivitySearchBinding) binding).recyclerMails.setAdapter(adapter);
        }
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
