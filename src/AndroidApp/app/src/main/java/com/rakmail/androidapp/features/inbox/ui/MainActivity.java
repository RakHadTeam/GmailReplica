package com.rakmail.androidapp.features.inbox.ui;
import android.content.Intent;
import android.os.Bundle;
import android.os.Handler;
import android.util.Log;
import android.view.Menu;
import android.view.MenuItem;
import androidx.annotation.NonNull;
import androidx.appcompat.app.ActionBarDrawerToggle;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.view.GravityCompat;
import androidx.drawerlayout.widget.DrawerLayout;
import androidx.lifecycle.ViewModelProvider;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;
import androidx.swiperefreshlayout.widget.SwipeRefreshLayout;
import com.google.android.material.appbar.MaterialToolbar;
import com.google.android.material.navigation.NavigationView;
import com.rakmail.androidapp.R;
import com.rakmail.androidapp.features.inbox.data.MailRepository;
import com.rakmail.androidapp.features.inbox.model.Mail;
import com.rakmail.androidapp.features.inbox.ui.adapter.MailAdapter;
import com.rakmail.androidapp.features.inbox.viewmodel.InboxViewModel;
import com.rakmail.androidapp.features.label.view.fragment.LabelManagerDialogFragment;
import com.rakmail.androidapp.features.sent.ui.SentActivity;
import com.rakmail.androidapp.features.user.data.repository.UserRepository;
import com.rakmail.androidapp.features.user.model.User;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.CountDownLatch;

public class MainActivity extends AppCompatActivity {
    private static final String TAG = "MainActivity";
    private static final long REFRESH_INTERVAL_MS = 10_000;
    private final Handler refreshHandler = new Handler();
    private final Runnable refreshRunnable = this::triggerMailRefresh;
    private DrawerLayout drawer;
    private NavigationView navView;
    private SwipeRefreshLayout swipeRefresh;
    private MailAdapter adapter;
    private InboxViewModel viewModel;
    private final UserRepository userRepo = new UserRepository();

    private void triggerMailRefresh() {
        viewModel.fetchMails();
        refreshHandler.postDelayed(refreshRunnable, REFRESH_INTERVAL_MS);
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        MaterialToolbar toolbar = findViewById(R.id.toolbar);
        setSupportActionBar(toolbar);

        drawer = findViewById(R.id.drawer_layout);
        navView = findViewById(R.id.navView);

        ActionBarDrawerToggle toggle = new ActionBarDrawerToggle(
            this, drawer, toolbar,
            R.string.open_drawer, R.string.close_drawer);
        drawer.addDrawerListener(toggle);
        toggle.syncState();

        navView.setNavigationItemSelectedListener(item -> {
            drawer.closeDrawer(GravityCompat.START);
            int id = item.getItemId();
            if (id == R.id.nav_inbox) {
                return true;
            } else if (id == R.id.nav_sent) {
                startActivity(new Intent(this, SentActivity.class));
                return true;
            }
            // TODO: add other destinations (Starred, Drafts …)
            return false;
        });

        navView.getHeaderView(0).findViewById(R.id.btnCompose)
            .setOnClickListener(v -> {
                // TODO open Compose activity / fragment
            });

        swipeRefresh = findViewById(R.id.swipeRefresh);
        RecyclerView rv = findViewById(R.id.recyclerMails);
        rv.setLayoutManager(new LinearLayoutManager(this));
        rv.setPadding(rv.getPaddingLeft(), 0, rv.getPaddingRight(), rv.getPaddingBottom());

        adapter = new MailAdapter();
        rv.setAdapter(adapter);

        adapter.setOnSelectionChangeListener(sel -> invalidateOptionsMenu());
        adapter.setOnDeleteMailListener(id ->
            new MailRepository().deleteMailById(id, new MailRepository.Callback() {
                @Override public void onSuccess() { Log.d(TAG, "Deleted mail " + id); }
                @Override public void onError(String msg){ Log.e(TAG, "Delete fail: " + msg); }
            }));

        viewModel = new ViewModelProvider(this).get(InboxViewModel.class);
        viewModel.getMails().observe(this, this::enrichMails);

        swipeRefresh.setOnRefreshListener(() -> viewModel.fetchMails());
        viewModel.fetchMails();
        refreshHandler.postDelayed(refreshRunnable, REFRESH_INTERVAL_MS);
    }

    @Override public boolean onCreateOptionsMenu(Menu menu) {
        if (adapter.getSelectedMailIds().isEmpty())
            getMenuInflater().inflate(R.menu.top_menu, menu);
        else
            getMenuInflater().inflate(R.menu.menu_mail_actions, menu);
        return true;
    }

    @Override public boolean onOptionsItemSelected(@NonNull MenuItem item) {
        if (item.getItemId() == R.id.action_manage_labels) {
            LabelManagerDialogFragment
                .newInstance(new ArrayList<>(adapter.getSelectedMailIds()))
                .show(getSupportFragmentManager(), "labelManager");
            return true;
        }
        return super.onOptionsItemSelected(item);
    }

    private void enrichMails(List<Mail> mails) {
        new Thread(() -> {
            List<Mail> enriched = new ArrayList<>();
            CountDownLatch latch = new CountDownLatch(mails.size());
            for (Mail mail : mails) {
                if (!mail.draft) {
                    if (mail.senderEmail == null || mail.senderEmail.isEmpty()) {
                        userRepo.getUserById(mail.senderId, new UserRepository.GetUserCallback() {
                            @Override public void onSuccess(User sender) {
                                mail.senderName    = sender.getFullname();
                                mail.senderEmail   = sender.getEmail();
                                mail.senderPicture = sender.picture;
                                latch.countDown();
                            }
                            @Override public void onFailure(String msg) {
                                Log.e(TAG, "Sender fetch failed"); latch.countDown();
                            }
                        });
                    } else latch.countDown();
                } else latch.countDown();
                enriched.add(mail);
            }
            try { latch.await(); } catch (InterruptedException ignored) {}
            runOnUiThread(() -> {
                adapter.setMails(enriched);
                swipeRefresh.setRefreshing(false);
            });
        }).start();
    }

    @Override protected void onDestroy() {
        super.onDestroy();
        refreshHandler.removeCallbacks(refreshRunnable);
    }
}
