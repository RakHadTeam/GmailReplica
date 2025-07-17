package com.rakmail.androidapp.features.inbox.ui;

import android.os.Bundle;
import android.os.Handler;
import android.util.Log;
import android.view.View;
import android.widget.ImageView;
import android.widget.TextView;
import android.view.Menu;
import android.view.MenuItem;

import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;
import androidx.lifecycle.ViewModelProvider;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;
import androidx.swiperefreshlayout.widget.SwipeRefreshLayout;

import com.google.android.material.appbar.MaterialToolbar;
import com.rakmail.androidapp.R;
import com.rakmail.androidapp.features.inbox.data.MailRepository;
import com.rakmail.androidapp.features.inbox.model.Mail;
import com.rakmail.androidapp.features.inbox.ui.adapter.MailAdapter;
import com.rakmail.androidapp.features.inbox.viewmodel.InboxViewModel;
import com.rakmail.androidapp.features.label.view.fragment.LabelManagerDialogFragment;
import com.rakmail.androidapp.features.user.data.repository.UserRepository;
import com.rakmail.androidapp.features.user.model.User;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.concurrent.CountDownLatch;

public class MainActivity extends AppCompatActivity {
    private static final String TAG = "MainActivity";
    private static final long REFRESH_INTERVAL_MS = 10_000;
    private final Handler refreshHandler = new Handler();
    private final Runnable refreshRunnable = this::triggerMailRefresh;

    private InboxViewModel viewModel;
    private MailAdapter adapter;
    private final UserRepository userRepo = new UserRepository();

    private View selectionBar;
    private TextView selectionCount;
    private ImageView btnDelete, btnMark, btnLabel;
    private SwipeRefreshLayout swipeRefresh;

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

        selectionBar   = findViewById(R.id.selectionBar);
        selectionCount = findViewById(R.id.selectionCount);
        btnDelete      = findViewById(R.id.btnDelete);
        btnMark        = findViewById(R.id.btnMark);
        btnLabel       = findViewById(R.id.btnLabel);
        swipeRefresh   = findViewById(R.id.swipeRefresh);

        RecyclerView rv = findViewById(R.id.recyclerMails);
        rv.setLayoutManager(new LinearLayoutManager(this));
        rv.setPadding(rv.getPaddingLeft(), 0, rv.getPaddingRight(), rv.getPaddingBottom());

        adapter = new MailAdapter();
        rv.setAdapter(adapter);

        adapter.setOnSelectionChangeListener(selectedIds -> {
            if (!selectedIds.isEmpty()) showSelectionBar(selectedIds);
            else hideSelectionBar();
        });

        adapter.setOnDeleteMailListener(id -> {
            new MailRepository().deleteMailById(id, new MailRepository.Callback() {
                @Override public void onSuccess() { Log.d(TAG, "Deleted mail: " + id); }
                @Override public void onError(String message) { Log.e(TAG, "Delete failed: " + message); }
            });
        });

        btnDelete.setOnClickListener(v -> {
            adapter.deleteSelected();
            hideSelectionBar();
        });

        btnMark.setOnClickListener(v -> {
            adapter.markSelected();
            hideSelectionBar();
        });

        btnLabel.setOnClickListener(v -> {
            Set<String> mailIds = adapter.getSelectedMailIds();
            LabelManagerDialogFragment dialog =
                LabelManagerDialogFragment.newInstance(new ArrayList<>(mailIds));
            dialog.show(getSupportFragmentManager(), "labelManager");
            hideSelectionBar();
        });

        viewModel = new ViewModelProvider(this).get(InboxViewModel.class);
        viewModel.getMails().observe(this, this::enrichMails);

        swipeRefresh.setOnRefreshListener(() -> viewModel.fetchMails());
        viewModel.fetchMails();
        refreshHandler.postDelayed(refreshRunnable, REFRESH_INTERVAL_MS);
    }

    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        getMenuInflater().inflate(R.menu.menu_mail_actions, menu);
        return true;
    }

    @Override
    public boolean onOptionsItemSelected(@NonNull MenuItem item) {
        if (item.getItemId() == R.id.action_manage_labels) {
            LabelManagerDialogFragment
                .newInstance(new ArrayList<>(adapter.getSelectedMailIds()))
                .show(getSupportFragmentManager(), "labelManager");
            return true;
        }
        return super.onOptionsItemSelected(item);
    }

    private int dpToPx(int dp) {
        float density = getResources().getDisplayMetrics().density;
        return Math.round(dp * density);
    }

    private void showSelectionBar(Set<String> selectedIds) {
        selectionBar.setVisibility(View.VISIBLE);
        RecyclerView recycler = findViewById(R.id.recyclerMails);
        recycler.setPadding(
            recycler.getPaddingLeft(), dpToPx(56),
            recycler.getPaddingRight(), recycler.getPaddingBottom()
        );
        selectionCount.setText(selectedIds.size() + " selected");
    }

// In MainActivity.java

    private void hideSelectionBar() {
        // If it's already hidden, bail out
        if (selectionBar.getVisibility() != View.VISIBLE) return;

        selectionBar.setVisibility(View.GONE);
        RecyclerView recycler = findViewById(R.id.recyclerMails);
        recycler.setPadding(
            recycler.getPaddingLeft(), 0,
            recycler.getPaddingRight(), recycler.getPaddingBottom()
        );
        adapter.setOnSelectionChangeListener(null);
        adapter.clearSelection();
        adapter.setOnSelectionChangeListener(selectedIds -> {
            if (!selectedIds.isEmpty()) showSelectionBar(selectedIds);
            else hideSelectionBar();
        });
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
                                Log.e(TAG, "Sender fetch failed");
                                latch.countDown();
                            }
                        });
                    } else latch.countDown();
                    // recipient filler omitted for brevity
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

    @Override
    protected void onDestroy() {
        super.onDestroy();
        refreshHandler.removeCallbacks(refreshRunnable);
    }
}