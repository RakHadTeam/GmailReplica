package com.rakmail.androidapp.features.inbox.ui;

import android.content.Intent;
import android.os.Bundle;
import android.os.Handler;
import android.os.Looper;
import android.util.Log;
import android.view.Menu;
import android.view.MenuItem;
import android.view.View;
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
import com.rakmail.androidapp.features.inbox.model.Mail;
import com.rakmail.androidapp.features.inbox.ui.ComposeMailActivity;
import com.rakmail.androidapp.features.inbox.ui.MailDetailActivity;
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

    private final Handler refreshHandler = new Handler(Looper.getMainLooper());
    private MailAdapter adapter;
    private ActivityMainBinding binding;
    private InboxViewModel inboxViewModel;
    private LabelViewModel labelViewModel;

    private void triggerMailRefresh() {
        Log.d(TAG, "Triggering mail refresh.");
        inboxViewModel.fetchMails();
        refreshHandler.postDelayed(refreshRunnable, REFRESH_INTERVAL_MS);
    }
    private final Runnable refreshRunnable = this::triggerMailRefresh;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        binding = ActivityMainBinding.inflate(getLayoutInflater());
        setContentView(binding.getRoot());

        setupLabelViewModel();
        setupToolbar();
        setupNavigationDrawer();
        setupViewModel();
        setupRecyclerView();
        setupSwipeToRefresh();
        setupComposeButton();
    }

    private void setupLabelViewModel() {
        labelViewModel = new ViewModelProvider(this).get(LabelViewModel.class);
        labelViewModel.fetchLabels();
        labelViewModel.visibleLabels().observe(this, labels -> {
            Menu menu = binding.navView.getMenu();
            menu.removeGroup(R.id.group_custom_labels);
            for (Label label : labels) {
                MenuItem item = menu.add(R.id.group_custom_labels,
                    label.getId().hashCode(), Menu.NONE, label.getName());
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
            int id = item.getItemId(); boolean handled = true;
            if (id == R.id.nav_inbox) {
                inboxViewModel.setCurrentLabelId(""); setTitle("Inbox");
            } else if (id == R.id.nav_sent) {
                Label sent = labelViewModel.getLabelByName("Sent");
                inboxViewModel.setCurrentLabelId(sent.getId()); setTitle("Sent");
            } else if (id == R.id.nav_spam) {
                Label spam = labelViewModel.getLabelByName("Spam");
                inboxViewModel.setCurrentLabelId(spam.getId()); setTitle("Spam");
            } else if (id == R.id.nav_bin) {
                Label bin = labelViewModel.getLabelByName("Bin");
                inboxViewModel.setCurrentLabelId(bin.getId()); setTitle("Bin");
            } else if (id == R.id.nav_starred) {
                Label star = labelViewModel.getLabelByName("Starred");
                inboxViewModel.setCurrentLabelId(star.getId()); setTitle("Starred");
            } else if (id == R.id.nav_drafts) {
                inboxViewModel.setCurrentLabelId("Drafts"); setTitle("Drafts");
            } else {
                Label lbl = labelViewModel.getLabelById(item.getTitleCondensed().toString());
                if (lbl != null) { inboxViewModel.setCurrentLabelId(lbl.getId()); setTitle(lbl.getName()); }
                else handled = false;
            }
            return handled;
        });
    }

    private void setupViewModel() {
        inboxViewModel = new ViewModelProvider(this,
            new InboxViewModelFactory(
                MailRepository.getInstance(),
                LabelRepository.getInstance(),
                UserRepository.getInstance()
            )).get(InboxViewModel.class);
        inboxViewModel.getVisibleMails().observe(this, mails -> {
            adapter.setMails(mails);
            binding.swipeRefresh.setRefreshing(false);
        });
        inboxViewModel.getIsLoading().observe(this,
            loading -> binding.swipeRefresh.setRefreshing(loading != null && loading));
        inboxViewModel.getErrorMessage().observe(this, err -> {
            if (err != null && !err.isEmpty()) Toast.makeText(this, err, Toast.LENGTH_LONG).show();
        });
        inboxViewModel.fetchMails();
    }

    private void setupRecyclerView() {
        adapter = new MailAdapter();
        binding.recyclerMails.setLayoutManager(new LinearLayoutManager(this));
        binding.recyclerMails.setAdapter(adapter);

        // Open draft in compose, others in detail
        adapter.setOnMailClickListener(mail -> {
            Intent it;
            if (mail.isDraft()) {
                it = new Intent(MainActivity.this, ComposeMailActivity.class);
                it.putExtra(ComposeMailActivity.EXTRA_DRAFT_ID, mail.getId());
                it.putExtra(ComposeMailActivity.EXTRA_DRAFT_RECIPIENT, mail.getRecipientEmail());
                it.putExtra(ComposeMailActivity.EXTRA_DRAFT_SUBJECT, mail.getSubject());
                it.putExtra(ComposeMailActivity.EXTRA_DRAFT_BODY, mail.getBody());
            } else {
                it = new Intent(MainActivity.this, MailDetailActivity.class);
                it.putExtra(MailDetailActivity.EXTRA_MAIL, mail);
            }
            startActivity(it);
        });

        adapter.setOnSelectionChangeListener(sel -> invalidateOptionsMenu());
        adapter.setOnDeleteMailListener(id -> inboxViewModel.deleteMailById(id));
    }

    private void setupSwipeToRefresh() {
        binding.swipeRefresh.setOnRefreshListener(() -> inboxViewModel.fetchMails());
    }

    private void setupComposeButton() {
        View header = binding.navView.getHeaderView(0);
        header.findViewById(R.id.btnCompose)
            .setOnClickListener(v -> startActivity(
                new Intent(MainActivity.this, ComposeMailActivity.class)));
    }

    @Override
    protected void onStart() {
        super.onStart();
        refreshHandler.post(refreshRunnable);
    }

    @Override
    protected void onStop() {
        super.onStop();
        refreshHandler.removeCallbacks(refreshRunnable);
    }

    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        Label cur = labelViewModel.getLabelById(inboxViewModel.getCurrentLabelId());
        if (adapter.getSelectedMailIds().isEmpty()) {
            getMenuInflater().inflate(R.menu.top_menu, menu);
        } else if (cur != null && "Bin".equals(cur.getName())) {
            getMenuInflater().inflate(R.menu.bin_mail_actions, menu);
        } else {
            getMenuInflater().inflate(R.menu.menu_mail_actions, menu);
        }
        return true;
    }

    @Override
    public boolean onOptionsItemSelected(@NonNull MenuItem item) {
        if (item.getItemId() == R.id.action_manage_labels
            && !adapter.getSelectedMailIds().isEmpty()) {
            LabelManagerDialogFragment.newInstance(
                    new ArrayList<>(adapter.getSelectedMailIds()))
                .show(getSupportFragmentManager(), "labelManager");
            return true;
        }
        return super.onOptionsItemSelected(item);
    }

    @Override
    protected void onDestroy() {
        super.onDestroy();
        refreshHandler.removeCallbacks(refreshRunnable);
        binding = null;
    }
}
