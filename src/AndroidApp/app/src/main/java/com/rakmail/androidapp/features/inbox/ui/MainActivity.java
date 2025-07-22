package com.rakmail.androidapp.features.inbox.ui;

import android.os.Bundle;
import android.view.Menu;
import android.view.MenuItem;

import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;
import androidx.lifecycle.ViewModelProvider;

import com.rakmail.androidapp.R;
import com.rakmail.androidapp.core.auth.AuthEventViewModel;
import com.rakmail.androidapp.databinding.ActivityMainBinding;
import com.rakmail.androidapp.features.inbox.ui.manager.MailListManager;
import com.rakmail.androidapp.features.inbox.ui.manager.MailRefreshManager;
import com.rakmail.androidapp.features.inbox.ui.manager.MenuManager;
import com.rakmail.androidapp.features.inbox.ui.manager.NavigationManager;
import com.rakmail.androidapp.features.inbox.ui.manager.UIActionsManager;
import com.rakmail.androidapp.features.inbox.ui.manager.ViewModelManager;
import com.rakmail.androidapp.features.inbox.viewmodel.InboxViewModel;
import com.rakmail.androidapp.features.mail.viewmodel.MailViewModel;
import com.rakmail.androidapp.features.label.view.drawer.LabelDrawerManager;
import com.rakmail.androidapp.features.label.viewmodel.LabelViewModel;
import com.rakmail.androidapp.features.search.ui.SearchActivity;

public class MainActivity extends AppCompatActivity {
    private static final String TAG = "MainActivity";
    private static final long REFRESH_INTERVAL_MS = 100_000;

    private ActivityMainBinding binding;
    private InboxViewModel inboxViewModel;
    private LabelViewModel labelViewModel;

    private MailViewModel mailViewModel;
    private LabelDrawerManager labelDrawerManager;
    private MailListManager mailListManager;
    private MailRefreshManager mailRefreshManager;
    private UIActionsManager uiActionsManager;
    private NavigationManager navigationManager;
    private ViewModelManager viewModelManager;
    private MenuManager menuManager;
    private AuthEventViewModel authEventViewModel;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        binding = ActivityMainBinding.inflate(getLayoutInflater());
        setContentView(binding.getRoot());

        viewModelManager = new ViewModelManager(binding, this, this);
        viewModelManager.setOnMailsChangedListener(mails -> mailListManager.getAdapter().setMails(mails));
        inboxViewModel = viewModelManager.getInboxViewModel();
        labelViewModel = viewModelManager.getLabelViewModel();
        mailViewModel = viewModelManager.getMailViewModel();
        inboxViewModel.observeLabelChanges(labelViewModel);
        labelDrawerManager = new LabelDrawerManager(labelViewModel, inboxViewModel, binding.navView, this);
        labelDrawerManager.setupLabelMenu();
        navigationManager = new NavigationManager(binding, this, labelDrawerManager);
        navigationManager.setupToolbar();
        navigationManager.setOnLabelSelectedListener(title -> {
            binding.toolbar.findViewById(R.id.toolbarTitle);
            android.widget.TextView toolbarTitle = binding.toolbar.findViewById(R.id.toolbarTitle);
            if (toolbarTitle != null) {
                toolbarTitle.setText(title);
            }
            mailListManager.onCurrentLabelChanged();
        });
        navigationManager.setupNavigationDrawer();
        mailListManager = new MailListManager(binding, this);
        uiActionsManager = new UIActionsManager(binding, mailViewModel, this);
        uiActionsManager.setupSwipeToRefresh();
        uiActionsManager.setupComposeButton();
        uiActionsManager.setupSearchButton();

        mailListManager.setOnMailSelectionChangeListener(selectedIds -> invalidateOptionsMenu());

        mailRefreshManager = new MailRefreshManager(mailViewModel, REFRESH_INTERVAL_MS);

        authEventViewModel = new ViewModelProvider(this).get(AuthEventViewModel.class);
        authEventViewModel.observeUnauthorizedEvent(this, this);

        menuManager = new MenuManager(this, labelViewModel, mailViewModel, mailListManager.getAdapter());
        menuManager.observeLabelChanges();
    }

    @Override
    protected void onStart() {
        super.onStart();
        mailRefreshManager.startAutoRefresh();
    }

    @Override
    protected void onStop() {
        super.onStop();
        mailRefreshManager.stopAutoRefresh();
    }

    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        return menuManager.onCreateOptionsMenu(menu);
    }

    @Override
    public boolean onOptionsItemSelected(@NonNull MenuItem item) {
        if (menuManager.onOptionsItemSelected(item)) {
            return true;
        }
        return super.onOptionsItemSelected(item);
    }

    @Override
    protected void onDestroy() {
        super.onDestroy();
        mailRefreshManager.stopAutoRefresh();
        binding = null; // Important for ViewBinding to avoid memory leaks in Activities
    }
}
