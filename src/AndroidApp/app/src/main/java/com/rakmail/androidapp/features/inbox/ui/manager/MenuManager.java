package com.rakmail.androidapp.features.inbox.ui.manager;

import android.content.Context;
import android.util.Log;
import android.view.Menu;
import android.view.MenuItem;
import android.widget.Toast;

import androidx.annotation.NonNull;

import com.rakmail.androidapp.R;
import com.rakmail.androidapp.core.prefs.AuthPreferences;
import com.rakmail.androidapp.features.inbox.ui.adapter.BaseMailAdapter;
import com.rakmail.androidapp.features.mail.viewmodel.MailViewModel;
import com.rakmail.androidapp.features.label.model.Label;
import com.rakmail.androidapp.features.label.view.fragment.LabelManagerDialogFragment;
import com.rakmail.androidapp.features.label.viewmodel.LabelViewModel;
import com.rakmail.androidapp.features.launcher.ui.LauncherActivity;
import com.rakmail.androidapp.features.settings.ui.SettingsFragment;

import java.util.ArrayList;

public class MenuManager {
    private final Context context;
    private final LabelViewModel labelViewModel;
    private final MailViewModel mailViewModel;
    private final BaseMailAdapter<?> mailAdapter;

    public MenuManager(Context context, LabelViewModel labelViewModel, MailViewModel mailViewModel, BaseMailAdapter<?> mailAdapter) {
        this.context = context;
        this.labelViewModel = labelViewModel;
        this.mailAdapter = mailAdapter;
        this.mailViewModel = mailViewModel;
    }

    public boolean onCreateOptionsMenu(Menu menu) {
        Label binLabel = labelViewModel.getLabelByName("Bin");
        boolean allInBin = allSelectedMailsHaveLabel(binLabel);
        Log.d("MenuManager", "All selected mails in bin: " + allInBin);
        Log.d("MenuManager", "Selected mail IDs: " + (mailAdapter != null ? mailAdapter.getSelectedMailIds() : "null"));
        if (mailAdapter == null || mailAdapter.getSelectedMailIds().isEmpty()) {
            inflateMenu(menu, R.menu.top_menu);
        } else if (allInBin) {
            inflateMenu(menu, R.menu.bin_mail_actions);
        } else {
            inflateMenu(menu, R.menu.menu_mail_actions);
        }
        updateBulkMenuItems(menu);
        return true;
    }

    private void updateBulkMenuItems(Menu menu) {
        updateBulkMenuItem(menu.findItem(R.id.action_star), "Starred", R.drawable.ic_star_filled, R.drawable.ic_star_outline);
        updateBulkMenuItem(menu.findItem(R.id.action_spam), "Spam", 0, 0);
        // Add more bulk actions here as needed
    }

    private void updateBulkMenuItem(MenuItem item, String labelName, int markedIcon, int unmarkedIcon) {
        if (item != null) {
            Label label = labelViewModel.getLabelByName(labelName);
            Log.d("MenuManager", "Label: " + (label != null ? label.getName() : "null") + " - Selected Mail IDs: " + (mailAdapter != null ? mailAdapter.getSelectedMailIds() : "null"));
            boolean allMarked = allSelectedMailsHaveLabel(label);
            Log.d("MenuManager", "All selected mails have label '" + labelName + "': " + allMarked);
            String text = context.getString(allMarked ? R.string.menu_unmark_as : R.string.menu_mark_as, labelName);
            int iconRes = allMarked ? markedIcon : unmarkedIcon;
            item.setTitle(text);
            if (iconRes != 0) {
                item.setIcon(iconRes);
            }
        }
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
            handleLogoutAction();
            return true;
        }
        if (itemId == R.id.action_manage_labels) {
            handleLabelsAction();
            return true;
        }
        if (itemId == R.id.action_delete) {
            handleDeleteAction();
            return true;
        }
        if (itemId == R.id.action_spam) {
            handleSpamAction(item);
            return true;
        }
        if (itemId == R.id.action_star) {
            handleStarAction(item);
            return true;
        }
        if (itemId == R.id.action_restore) {
            handleRestoreAction();
            return true;
        }
        return false;
    }

    private void handleRestoreAction() {
        Label binLabel = labelViewModel.getLabelByName("Bin");
        if (mailAdapter != null && !mailAdapter.getSelectedMailIds().isEmpty() && binLabel != null) {
            boolean allInBin = allSelectedMailsHaveLabel(binLabel);
            if (allInBin) {
                handleBulkLabelToggle(binLabel);
            } else {
                Toast.makeText(context, "Not all selected mails are in the Bin", Toast.LENGTH_SHORT).show();
            }
        } else {
            Toast.makeText(context, "No mail selected for restore", Toast.LENGTH_SHORT).show();
        }
    }

    private void handleLabelsAction() {
        if (mailAdapter != null && !mailAdapter.getSelectedMailIds().isEmpty()) {
            LabelManagerDialogFragment
                .newInstance(new ArrayList<>(mailAdapter.getSelectedMailIds()))
                .show(((androidx.appcompat.app.AppCompatActivity) context).getSupportFragmentManager(), "labelManager");
        } else {
            Toast.makeText(context, "No mail selected for labels", Toast.LENGTH_SHORT).show();
        }
    }

    private void handleLogoutAction() {
        AuthPreferences.getInstance().clearSession();
        android.content.Intent intent = new android.content.Intent(context, LauncherActivity.class);
        intent.setFlags(android.content.Intent.FLAG_ACTIVITY_NEW_TASK | android.content.Intent.FLAG_ACTIVITY_CLEAR_TASK);
        context.startActivity(intent);
        if (context instanceof androidx.appcompat.app.AppCompatActivity) {
            ((androidx.appcompat.app.AppCompatActivity) context).finish();
        }
    }

    private void handleDeleteAction() {
        if (mailAdapter != null && !mailAdapter.getSelectedMailIds().isEmpty()) {
            Label binLabel = labelViewModel.getLabelByName("Bin");
            boolean allInBin = allSelectedMailsHaveLabel(binLabel);

            if (!allInBin) {
                handleBulkLabelToggle(binLabel);
            } else {
                for (String mailId : mailAdapter.getSelectedMailIds()) {
                     mailViewModel.deleteMailById(mailId);
                }
                // Clear selection after deletion
                mailAdapter.clearSelection();
            }
        } else {
            Toast.makeText(context, "No mail selected for delete", Toast.LENGTH_SHORT).show();
        }
    }

    public void observeLabelChanges() {
        labelViewModel.getLabelChangedEvent().observeForever(changed -> {
            if (Boolean.TRUE.equals(changed)) {
                if (context instanceof androidx.appcompat.app.AppCompatActivity) {
                    ((androidx.appcompat.app.AppCompatActivity) context).invalidateOptionsMenu();
                }
                labelViewModel.resetLabelChangedEvent();
            }
        });
    }

    private boolean allSelectedMailsHaveLabel(Label label) {
        if (label == null || label.getMailIds() == null) return false;
        for (String mailId : mailAdapter.getSelectedMailIds()) {
            if (!label.getMailIds().contains(mailId)) {
                return false;
            }
        }
        return true;
    }

    private void handleBulkLabelToggle(Label label) {
        if (mailAdapter == null || mailAdapter.getSelectedMailIds().isEmpty()) return;
        boolean allHaveLabel = allSelectedMailsHaveLabel(label);
        if (label != null) {
            for (String mailId : mailAdapter.getSelectedMailIds()) {
                labelViewModel.toggle(label.getId(), mailId, !allHaveLabel);
            }
        }
    }

    private void handleStarAction(MenuItem item) {
        Label starLabel = labelViewModel.getLabelByName("Starred");
        handleBulkLabelToggle(starLabel);
        updateBulkMenuItem(item, "Starred", R.drawable.ic_star_filled, R.drawable.ic_star_outline);
    }

    private void handleSpamAction(MenuItem item) {
        Label spamLabel = labelViewModel.getLabelByName("Spam");
        handleBulkLabelToggle(spamLabel);
        updateBulkMenuItem(item, "Spam", R.drawable.ic_report_off, R.drawable.ic_report);
    }

}

