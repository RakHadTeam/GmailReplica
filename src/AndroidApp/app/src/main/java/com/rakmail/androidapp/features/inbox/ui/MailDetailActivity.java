package com.rakmail.androidapp.features.inbox.ui;

import android.os.Bundle;

import androidx.appcompat.app.AppCompatActivity;
import androidx.lifecycle.ViewModelProvider;

import com.rakmail.androidapp.features.inbox.model.Mail;
import com.rakmail.androidapp.features.inbox.ui.adapter.MailDetailAdapter;
import com.rakmail.androidapp.features.inbox.ui.manager.MenuManager;
import com.rakmail.androidapp.features.inbox.viewmodel.MailDetailViewModel;
import com.rakmail.androidapp.features.label.viewmodel.LabelViewModel;

public class MailDetailActivity extends AppCompatActivity {

    public static final String EXTRA_MAIL = "extra_mail";
    private MailDetailViewModel vm;
    private com.rakmail.androidapp.databinding.ActivityMailDetailBinding binding;
    private MailDetailAdapter mailDetailAdapter;
    private MenuManager menuManager;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        binding = com.rakmail.androidapp.databinding.ActivityMailDetailBinding.inflate(getLayoutInflater());
        setContentView(binding.getRoot());

        vm = new ViewModelProvider(this).get(MailDetailViewModel.class);
        mailDetailAdapter = new MailDetailAdapter();
        binding.mailDetailRecyclerView.setAdapter(mailDetailAdapter);
        binding.mailDetailRecyclerView.setLayoutManager(new androidx.recyclerview.widget.LinearLayoutManager(this));
        LabelViewModel labelViewModel = new ViewModelProvider(this).get(LabelViewModel.class);
        com.rakmail.androidapp.features.inbox.viewmodel.InboxViewModel inboxViewModel = null; // Not needed for single mail
        menuManager = new MenuManager(this, labelViewModel, null);

        vm.getMail().observe(this, m -> {
            if (m == null) {
                finish();
                return;
            }
            mailDetailAdapter.setMail(m);
        });

        // inject initial mail
        Mail in = getIntent().getParcelableExtra(EXTRA_MAIL);
        if (in != null) {
            vm.setMail(in);
        } else {
            String id = getIntent().getStringExtra("mailId");
            vm.load(id);
        }

        setSupportActionBar(binding.toolbar);
        binding.toolbar.setNavigationOnClickListener(v -> finish());
    }

    @Override
    public boolean onCreateOptionsMenu(android.view.Menu menu) {
        return menuManager.onCreateOptionsMenu(menu);
    }

    @Override
    protected void onStart() {
        super.onStart();
        // Removed old observer for getMail, now handled by isStarred/isBinned observers
    }

    @Override
    public boolean onOptionsItemSelected(android.view.MenuItem item) {
        if (menuManager.onOptionsItemSelected(item)) {
            return true;
        }
        return super.onOptionsItemSelected(item);
    }




}
