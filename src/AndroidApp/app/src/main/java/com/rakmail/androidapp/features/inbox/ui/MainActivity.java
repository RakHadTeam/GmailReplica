package com.rakmail.androidapp.features.inbox.ui;

import android.os.Bundle;
import android.os.Handler;
import android.os.Looper;
import android.util.Log;
import android.view.Menu;
import android.view.MenuItem;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.appcompat.app.ActionBarDrawerToggle;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.view.GravityCompat;
import androidx.lifecycle.ViewModelProvider;
import androidx.recyclerview.widget.LinearLayoutManager;

import com.rakmail.androidapp.R;
import com.rakmail.androidapp.databinding.ActivityMainBinding;
import com.rakmail.androidapp.features.inbox.data.MailRepository;
import com.rakmail.androidapp.features.inbox.ui.adapter.MailAdapter;
import com.rakmail.androidapp.features.inbox.viewmodel.InboxViewModel;
import com.rakmail.androidapp.features.inbox.viewmodel.InboxViewModelFactory;
import com.rakmail.androidapp.features.label.model.Label;
import com.rakmail.androidapp.features.label.repository.LabelRepository;
import com.rakmail.androidapp.features.label.view.fragment.LabelManagerDialogFragment;
import com.rakmail.androidapp.features.label.viewmodel.LabelViewModel;
import com.rakmail.androidapp.features.user.data.repository.UserRepository;

import java.util.ArrayList;

public class MainActivity extends AppCompatActivity {
    private static final String TAG = "MainActivity";
    private static final long REFRESH_INTERVAL_MS = 10_000;

    private final Handler refreshHandler = new Handler(Looper.getMainLooper()); // Best practice to specify Looper
    private MailAdapter adapter;
    private ActivityMainBinding binding;
    private InboxViewModel inboxViewModel;
    private LabelViewModel labelViewModel;

    private void triggerMailRefresh() {
        Log.d(TAG, "Triggering mail refresh.");
        inboxViewModel.fetchMails();
        refreshHandler.postDelayed(refreshRunnable, REFRESH_INTERVAL_MS);
    }    private final Runnable refreshRunnable = this::triggerMailRefresh;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        binding = ActivityMainBinding.inflate(getLayoutInflater());
        setContentView(binding.getRoot());

        setupLabelViewModel();
        setupToolbar();
        setupNavigationDrawer();
        setupRecyclerView();
        setupViewModel();
        setupSwipeToRefresh();
        setupComposeButton();
    }

    private void setupLabelViewModel() {
        labelViewModel = new ViewModelProvider(this).get(LabelViewModel.class);
        // Only fetch labels once on startup
        labelViewModel.fetchLabels();
        labelViewModel.visibleLabels().observe(this, labels -> {
            Log.d(TAG, "Labels updated: " + labels.size());
            Menu menu = binding.navView.getMenu();
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

    private void setupToolbar() {
        setSupportActionBar(binding.toolbar);
        if (getSupportActionBar() != null) {
            getSupportActionBar().setDisplayHomeAsUpEnabled(true);
            getSupportActionBar().setHomeButtonEnabled(true);
        }
    }

    private void setupNavigationDrawer() {
        ActionBarDrawerToggle toggle = new ActionBarDrawerToggle(
            this, binding.drawerLayout, binding.toolbar,
            R.string.open_drawer, R.string.close_drawer);
        binding.drawerLayout.addDrawerListener(toggle);
        toggle.syncState();

        binding.navView.setNavigationItemSelectedListener(item -> {
            binding.drawerLayout.closeDrawer(GravityCompat.START);
            int id = item.getItemId();
            boolean handled = true;

            if (id == R.id.nav_inbox) {
                inboxViewModel.setCurrentLabelId("");
                setTitle("Inbox");
            } else if (id == R.id.nav_sent) {
                Label sentLabel = labelViewModel.getLabelByName("Sent");
                inboxViewModel.setCurrentLabelId(sentLabel.getId());
                setTitle("Sent");
            } else if (id == R.id.nav_spam) {
                Label spamLabel = labelViewModel.getLabelByName("Spam");
                inboxViewModel.setCurrentLabelId(spamLabel.getId());
                setTitle("Spam");
            } else if (id == R.id.nav_bin) {
                Label binLabel = labelViewModel.getLabelByName("Bin");
                Log.d(TAG, "Setting current label to Bin: " + binLabel.getId());
                // print the mails
                Log.d(TAG, "Bin mails: " + binLabel.getMailsIds());
                inboxViewModel.setCurrentLabelId(binLabel.getId());
                setTitle("Bin");
            } else if (id == R.id.nav_starred) {
                Label starredLabel = labelViewModel.getLabelByName("Starred");
                inboxViewModel.setCurrentLabelId(starredLabel.getId());
                setTitle("Starred");
            } else if (id == R.id.nav_drafts) {
                inboxViewModel.setCurrentLabelId("Drafts");
                setTitle("Drafts");
            } else {
                Label label = labelViewModel.getLabelById(item.getTitleCondensed().toString());
                if (label != null) {
                    inboxViewModel.setCurrentLabelId(label.getId());
                    setTitle(label.getName());
                } else {
                    Log.w(TAG, "Label not found for id: " + item.getTitleCondensed());
                    handled = false; // If label not found, do not handle the click
                }
            }
            return handled;
        });
    }

    private void setupRecyclerView() {
        adapter = new MailAdapter();
        binding.recyclerMails.setLayoutManager(new LinearLayoutManager(this));

        binding.recyclerMails.setAdapter(adapter);

        adapter.setOnSelectionChangeListener(selectedIds -> invalidateOptionsMenu());

        adapter.setOnDeleteMailListener(mailId -> {
            inboxViewModel.deleteMailById(mailId);
        });
    }

    private void setupViewModel() {
        MailRepository mailRepository = MailRepository.getInstance();
        LabelRepository labelRepository = LabelRepository.getInstance();
        UserRepository userRepository = UserRepository.getInstance();
        InboxViewModelFactory factory = new InboxViewModelFactory(mailRepository, labelRepository, userRepository);
        inboxViewModel = new ViewModelProvider(this, factory).get(InboxViewModel.class);

        inboxViewModel.getVisibleMails().observe(this, mails -> {
            adapter.setMails(mails);
            if (binding.swipeRefresh.isRefreshing()) {
                binding.swipeRefresh.setRefreshing(false);
            }
        });

        inboxViewModel.getIsLoading().observe(this, isLoading -> {
            binding.swipeRefresh.setRefreshing(isLoading != null && isLoading);
        });
        inboxViewModel.getErrorMessage().observe(this, error -> {
            if (error != null && !error.isEmpty()) {
                Toast.makeText(this, error, Toast.LENGTH_LONG).show();
            }
        });

        inboxViewModel.fetchMails();
    }

    private void setupSwipeToRefresh() {
        binding.swipeRefresh.setOnRefreshListener(() -> {
            inboxViewModel.fetchMails();
        });
    }

    private void setupComposeButton() {
        binding.navView.getHeaderView(0).findViewById(R.id.btnCompose)
            .setOnClickListener(v -> {
                Toast.makeText(this, "Compose mail clicked (TODO)", Toast.LENGTH_SHORT).show();
                // TODO: open Compose activity / fragment
            });
    }

    private void startAutoRefresh() {
        refreshHandler.removeCallbacks(refreshRunnable);
        refreshHandler.post(refreshRunnable);
    }

    private void stopAutoRefresh() {
        refreshHandler.removeCallbacks(refreshRunnable);
    }

    @Override
    protected void onStart() {
        super.onStart();
        // Start auto-refresh when the activity becomes visible
        startAutoRefresh();
    }

    @Override
    protected void onStop() {
        super.onStop();
        // Stop auto-refresh when the activity is no longer visible
        stopAutoRefresh();
    }

    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        Label currentLabel = labelViewModel.getLabelById(inboxViewModel.getCurrentLabelId());
        if (adapter == null || adapter.getSelectedMailIds().isEmpty()) {
            getMenuInflater().inflate(R.menu.top_menu, menu);
        } else if (currentLabel != null && currentLabel.getName().equals("Bin")) {
            getMenuInflater().inflate(R.menu.bin_mail_actions, menu);
        } else {
            getMenuInflater().inflate(R.menu.menu_mail_actions, menu);
        }
        return true;
    }

    @Override
    public boolean onOptionsItemSelected(@NonNull MenuItem item) {
        int itemId = item.getItemId();
        if (itemId == R.id.action_manage_labels) {
            if (adapter != null && !adapter.getSelectedMailIds().isEmpty()) {
                LabelManagerDialogFragment
                    .newInstance(new ArrayList<>(adapter.getSelectedMailIds()))
                    .show(getSupportFragmentManager(), "labelManager");
            } else {
//                Toast.makeText(this, getString(R.string.no_mail_selected_for_labels), Toast.LENGTH_SHORT).show();
            }
            return true;
        }
        if (itemId == R.id.action_delete) {
            // Todo: Implement delete action
            // check if its binned already
            // if true, delete the mails directly using MailApi
            // if false, toggle label "Bin" with applyExplicit true
            // use adapter.getSelectedMailIds() to get selected mails
            // for each
            // toggle with labelId "Bin" and applyExplicit true
            // using labelViewModel.toggleLabel("Bin", mailId, true);

        }

        // Handle other menu items if any
        return super.onOptionsItemSelected(item);
    }

    @Override
    protected void onDestroy() {
        super.onDestroy();
        stopAutoRefresh();
        binding = null; // Important for ViewBinding to avoid memory leaks in Activities
    }


}
