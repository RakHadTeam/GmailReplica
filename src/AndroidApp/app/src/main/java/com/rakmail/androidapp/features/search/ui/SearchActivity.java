package com.rakmail.androidapp.features.search.ui;

import android.os.Bundle;
import android.text.Editable;
import android.text.TextWatcher;
import androidx.annotation.Nullable;
import androidx.appcompat.app.AppCompatActivity;
import androidx.lifecycle.ViewModelProvider;
import com.rakmail.androidapp.databinding.ActivitySearchBinding;
import com.rakmail.androidapp.features.inbox.ui.manager.MailListManager;
import com.rakmail.androidapp.features.mail.viewmodel.MailViewModel;
import com.rakmail.androidapp.features.search.viewmodel.SearchViewModel;

public class SearchActivity extends AppCompatActivity {
    private SearchViewModel searchViewModel;
    private MailViewModel mailViewModel;
    private MailListManager mailListManager;
    private ActivitySearchBinding binding;

    @Override
    protected void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        binding = ActivitySearchBinding.inflate(getLayoutInflater());
        setContentView(binding.getRoot());

        searchViewModel = new ViewModelProvider(this).get(SearchViewModel.class);
        mailViewModel = new ViewModelProvider(this).get(MailViewModel.class);
        searchViewModel.setMailViewModel(mailViewModel);
        mailListManager = new MailListManager(binding, this);
        searchViewModel.getSearchResults().observe(this, mails -> mailListManager.getAdapter().setMails(mails));
        searchViewModel.getErrorMessage().observe(this, error -> {/* Optionally show error */});

        binding.searchInput.requestFocus();
        binding.searchInput.addTextChangedListener(new TextWatcher() {
            @Override
            public void beforeTextChanged(CharSequence s, int start, int count, int after) {}
            @Override
            public void onTextChanged(CharSequence s, int start, int before, int count) {
                searchViewModel.searchMails(s.toString());
            }
            @Override
            public void afterTextChanged(Editable s) {}
        });

        binding.btnBack.setOnClickListener(v -> finish());
    }
}
