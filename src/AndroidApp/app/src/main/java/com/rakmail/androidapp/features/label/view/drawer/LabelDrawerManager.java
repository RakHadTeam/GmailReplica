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
    private final NavigationView navView;
    private final LifecycleOwner lifecycleOwner;

    public LabelDrawerManager(LabelViewModel labelViewModel, InboxViewModel inboxViewModel, NavigationView navView, LifecycleOwner lifecycleOwner) {
        this.labelViewModel = labelViewModel;
        this.inboxViewModel = inboxViewModel;
        this.navView = navView;
        this.lifecycleOwner = lifecycleOwner;
    }

    public void setupLabelMenu() {
        labelViewModel.visibleLabels().observe(lifecycleOwner, labels -> {
            Log.d(TAG, "Labels updated: " + labels.size());
            Menu menu = navView.getMenu();
            int customGroupId = R.id.group_custom_labels;
            menu.removeGroup(customGroupId);
            for (Label label : labels) {
                Log.d(TAG, "Adding label to menu: " + label.getName());
                MenuItem item = menu.add(customGroupId, label.getId().hashCode(), Menu.NONE, label.getName());
                item.setIcon(R.drawable.ic_label);
                item.setTitleCondensed(label.getId());
            }
        });
    }

    public boolean handleNavigationItemSelected(MenuItem item) {
        int id = item.getItemId();
        if (id == R.id.nav_inbox) {
            inboxViewModel.setCurrentLabelId("");
            return true;
        } else if (id == R.id.nav_sent) {
            Label sentLabel = labelViewModel.getLabelByName("Sent");
            if (sentLabel != null) {
                inboxViewModel.setCurrentLabelId(sentLabel.getId());
            } else {
                Log.e(TAG, "Sent label not found");
            }
            return true;
        } else if (id == R.id.nav_spam) {
            Label spamLabel = labelViewModel.getLabelByName("Spam");
            if (spamLabel != null) {
                inboxViewModel.setCurrentLabelId(spamLabel.getId());
            } else {
                Log.e(TAG, "Spam label not found");
            }
            return true;
        } else if (id == R.id.nav_bin) {
            Label binLabel = labelViewModel.getLabelByName("Bin");
            if (binLabel != null) {
                Log.d(TAG, "Setting current label to Bin: " + binLabel.getId());
                Log.d(TAG, "Bin mails: " + binLabel.getMailsIds());
                inboxViewModel.setCurrentLabelId(binLabel.getId());
            } else {
                Log.e(TAG, "Bin label not found");
            }
            return true;
        } else if (id == R.id.nav_starred) {
            Label starredLabel = labelViewModel.getLabelByName("Starred");
            if (starredLabel != null) {
                inboxViewModel.setCurrentLabelId(starredLabel.getId());
            } else {
                Log.e(TAG, "Starred label not found");
            }
            return true;
        } else if (id == R.id.nav_drafts) {
            Label draftsLabel = labelViewModel.getLabelByName("Drafts");
            if (draftsLabel != null) {
                inboxViewModel.setCurrentLabelId(draftsLabel.getId());
            } else {
                Log.e(TAG, "Drafts label not found");
            }
            return true;
        } else {
            // Custom label
            String labelId = item.getTitleCondensed().toString();
            inboxViewModel.setCurrentLabelId(labelId);
            return true;
        }
    }
}
