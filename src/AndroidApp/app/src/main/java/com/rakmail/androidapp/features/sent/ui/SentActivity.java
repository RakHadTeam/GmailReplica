package com.rakmail.androidapp.features.sent.ui;

import android.os.Bundle;
import androidx.appcompat.app.AppCompatActivity;
import androidx.lifecycle.ViewModelProvider;
import androidx.recyclerview.widget.LinearLayoutManager;
import com.rakmail.androidapp.R;
import com.rakmail.androidapp.features.inbox.ui.adapter.MailAdapter;
import com.rakmail.androidapp.features.sent.viewmodel.SentViewModel;
import androidx.swiperefreshlayout.widget.SwipeRefreshLayout;
import androidx.recyclerview.widget.RecyclerView;

public class SentActivity extends AppCompatActivity {

    private SentViewModel vm;
    private MailAdapter   adapter;

    @Override protected void onCreate(Bundle b) {
        super.onCreate(b);
        setContentView(R.layout.activity_sent);

        SwipeRefreshLayout swipe  = findViewById(R.id.swipeRefresh);
        RecyclerView       list   = findViewById(R.id.recyclerMails);

        adapter = new MailAdapter();
        list.setLayoutManager(new LinearLayoutManager(this));
        list.setAdapter(adapter);

        vm = new ViewModelProvider(this).get(SentViewModel.class);
        vm.getMails().observe(this, mails -> {
            adapter.setMails(mails);
            swipe.setRefreshing(false);
        });

        swipe.setOnRefreshListener(vm::fetchSent);
        vm.fetchSent();          // first load
    }
}
