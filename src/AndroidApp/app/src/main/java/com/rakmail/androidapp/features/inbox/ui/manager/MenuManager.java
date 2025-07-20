package com.rakmail.androidapp.features.inbox.ui.manager;

import android.content.Context;
import android.view.Menu;
import android.view.MenuItem;
import android.widget.Toast;

import androidx.annotation.NonNull;

import com.rakmail.androidapp.R;
import com.rakmail.androidapp.core.auth.AuthPreferences;
import com.rakmail.androidapp.features.inbox.ui.adapter.BaseMailAdapter;
import com.rakmail.androidapp.features.label.model.Label;
import com.rakmail.androidapp.features.label.view.fragment.LabelManagerDialogFragment;
import com.rakmail.androidapp.features.label.viewmodel.LabelViewModel;
import com.rakmail.androidapp.features.launcher.ui.LauncherActivity;
import com.rakmail.androidapp.features.settings.ui.SettingsFragment;

import java.util.ArrayList;

public class MenuManager {
    private final Context context;
    private final LabelViewModel labelViewModel;
    private final BaseMailAdapter<?> mailAdapter;

    public MenuManager(Context context, LabelViewModel labelViewModel, BaseMailAdapter<?> mailAdapter) {
        this.context = context;
        this.labelViewModel = labelViewModel;
        this.mailAdapter = mailAdapter;
    }

    public boolean onCreateOptionsMenu(Menu menu) {
        Label binLabel = labelViewModel.getLabelByName("Bin");
        boolean allInBin = allSelectedMailsHaveLabel(binLabel);
        if (mailAdapter == null || mailAdapter.getSelectedMailIds().isEmpty()) {
            inflateMenu(menu, R.menu.top_menu);
        } else if (allInBin) {
            inflateMenu(menu, R.menu.bin_mail_actions);
        } else {
            inflateMenu(menu, R.menu.menu_mail_actions);
        }
        return true;
    }

    private void inflateMenu(Menu menu, int menuRes) {
        if (context instanceof androidx.appcompat.app.AppCompatActivity) {
            ((androidx.appcompat.app.AppCompatActivity) context).getMenuInflater().inflate(menuRes, menu);
        }
    }

    public boolean onOptionsItemSelected(@NonNull MenuItem item) {
        int itemId = item.getItemId();
        if (itemId == R.id.action_settings) {
            SettingsFragment.show(((androidx.appcompat.app.AppCompatActivity) context).getSupportFragmentManager());
            return true;
        }
        if (itemId == R.id.action_logout) {
            AuthPreferences.getInstance().clearSession();
            android.content.Intent intent = new android.content.Intent(context, LauncherActivity.class);
            intent.setFlags(android.content.Intent.FLAG_ACTIVITY_NEW_TASK | android.content.Intent.FLAG_ACTIVITY_CLEAR_TASK);
            context.startActivity(intent);
            if (context instanceof androidx.appcompat.app.AppCompatActivity) {
                ((androidx.appcompat.app.AppCompatActivity) context).finish();
            }
            return true;
        }
        if (itemId == R.id.action_manage_labels) {
            if (mailAdapter != null && !mailAdapter.getSelectedMailIds().isEmpty()) {
                LabelManagerDialogFragment
                    .newInstance(new ArrayList<>(mailAdapter.getSelectedMailIds()))
                    .show(((androidx.appcompat.app.AppCompatActivity) context).getSupportFragmentManager(), "labelManager");
            } else {
                Toast.makeText(context, "No mail selected for labels", Toast.LENGTH_SHORT).show();
            }
            return true;
        }
        if (itemId == R.id.action_delete) {
            // TODO: Implement delete action
            // ...existing logic...
            return true;
        }
        if (itemId == R.id.action_spam) {
            handleBulkSpam(item);
            return true;
        }
        if (itemId == R.id.action_star) {
            handleBulkStar(item);
            return true;
        }
        return false;
    }

    private boolean allSelectedMailsHaveLabel(Label label) {
        if (label == null || label.getMailsIds() == null) return false;
        for (String mailId : mailAdapter.getSelectedMailIds()) {
            if (!label.getMailsIds().contains(mailId)) {
                return false;
            }
        }
        return true;
    }

    private void handleBulkSpam(MenuItem item) {
        if (mailAdapter != null && !mailAdapter.getSelectedMailIds().isEmpty()) {
            Label spamLabel = labelViewModel.getLabelByName("Spam");
            boolean allSpam = allSelectedMailsHaveLabel(spamLabel);
            item.setTitle(allSpam ? "Mark as not spam" : "Mark as Spam");
            if (spamLabel != null) {
                for (String mailId : mailAdapter.getSelectedMailIds()) {
                    labelViewModel.toggle(spamLabel.getId(), mailId, !allSpam);
                }
            }
            if (context instanceof androidx.appcompat.app.AppCompatActivity) {
                ((androidx.appcompat.app.AppCompatActivity) context).invalidateOptionsMenu();
            }
        }
    }

    private void handleBulkStar(MenuItem item) {
        if (mailAdapter != null && !mailAdapter.getSelectedMailIds().isEmpty()) {
            Label starLabel = labelViewModel.getLabelByName("Starred");
            boolean allStarred = allSelectedMailsHaveLabel(starLabel);
            item.setTitle(allStarred ? "Unstar" : "Star");
            item.setIcon(allStarred ? R.drawable.ic_star_filled : R.drawable.ic_star_outline);
            if (starLabel != null) {
                for (String mailId : mailAdapter.getSelectedMailIds()) {
                    labelViewModel.toggle(starLabel.getId(), mailId, !allStarred);
                }
            }
            if (context instanceof androidx.appcompat.app.AppCompatActivity) {
                ((androidx.appcompat.app.AppCompatActivity) context).invalidateOptionsMenu();
            }
        }
    }
}
