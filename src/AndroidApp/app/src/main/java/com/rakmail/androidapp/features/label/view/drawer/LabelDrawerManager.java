package com.rakmail.androidapp.features.label.view.drawer;

import android.util.Log;
import android.view.Menu;
import android.view.MenuItem;

import androidx.lifecycle.LifecycleOwner;

import com.google.android.material.navigation.NavigationView;
import com.rakmail.androidapp.R;
import com.rakmail.androidapp.features.inbox.viewmodel.InboxViewModel;
import com.rakmail.androidapp.features.label.model.Label;
import com.rakmail.androidapp.features.label.viewmodel.LabelViewModel;

public class LabelDrawerManager {
    private static final String TAG = "LabelDrawerManager";
    private final LabelViewModel labelViewModel;
    private final InboxViewModel inboxViewModel;
    private final NavigationView navigationView;
    private final LifecycleOwner lifecycleOwner;

    public LabelDrawerManager(LabelViewModel labelViewModel, InboxViewModel inboxViewModel, NavigationView navigationView, LifecycleOwner lifecycleOwner) {
        this.labelViewModel = labelViewModel;
        this.inboxViewModel = inboxViewModel;
        this.navigationView = navigationView;
        this.lifecycleOwner = lifecycleOwner;
    }

    public void setupLabelMenu() {
        labelViewModel.getVisibleLabels().observe(lifecycleOwner, this::populateMenu);
        labelViewModel.getLabelChangedEvent().observe(lifecycleOwner, changed -> {
            Log.d(TAG, "Label changed event received: " + changed);
            if (Boolean.TRUE.equals(changed)) {
                Log.d(TAG, "Processing label change event - refreshing menu");
                populateMenu(labelViewModel.getVisibleLabels().getValue());
                labelViewModel.resetLabelChangedEvent();
            }
        });

        // Also observe the main labels LiveData directly for immediate updates
        labelViewModel.getLabels().observe(lifecycleOwner, allLabels -> {
            Log.d(TAG, "Raw labels changed, size: " + (allLabels != null ? allLabels.size() : 0));
            // Trigger filtering which will update visibleLabels
            if (allLabels != null) {
                populateMenu(labelViewModel.getVisibleLabels().getValue());
            }
        });
    }

    private void populateMenu(java.util.List<Label> labels) {
        if (labels == null) return;
        Log.d(TAG, "Labels updated: " + labels.size());
        Menu menu = navigationView.getMenu();
        int customGroupId = R.id.group_custom_labels;
        menu.removeGroup(customGroupId);
        for (Label label : labels) {
            MenuItem item = menu.add(customGroupId, label.getId().hashCode(), Menu.NONE, label.getName());
            item.setIcon(R.drawable.ic_label);
            item.setTitleCondensed(label.getId());
        }
        navigationView.invalidate();
        navigationView.requestLayout();
    }

    public void refreshMenu() {
        populateMenu(labelViewModel.getVisibleLabels().getValue());
    }

    public boolean onNavigationItemSelected(MenuItem item) {
        int id = item.getItemId();
        String[] systemLabels = {"Sent", "Spam", "Bin", "Starred"};
        for (String sysLabel : systemLabels) {
            int resId = getSystemLabelResId(sysLabel);
            if (id == resId) {
                Label label = labelViewModel.getLabelByName(sysLabel);
                if (label != null) {
                    inboxViewModel.setCurrentLabelId(label.getId());
                } else {
                    Log.e(TAG, sysLabel + " label not found");
                }
                return true;
            }
        }
        if (id == R.id.nav_inbox) {
            inboxViewModel.setCurrentLabelId("");
        } else {
            String labelId = item.getTitleCondensed().toString();
            Log.d(TAG, "Selected label ID: " + labelId);
            inboxViewModel.setCurrentLabelId(labelId);
        }
        return true;
    }

    private int getSystemLabelResId(String labelName) {
        switch (labelName) {
            case "Sent": return R.id.nav_sent;
            case "Spam": return R.id.nav_spam;
            case "Bin": return R.id.nav_bin;
            case "Starred": return R.id.nav_starred;
            case "Drafts": return R.id.nav_drafts;
            default: return -1;
        }
    }
}
