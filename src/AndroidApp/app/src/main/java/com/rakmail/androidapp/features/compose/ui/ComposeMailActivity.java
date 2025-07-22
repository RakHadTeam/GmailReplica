package com.rakmail.androidapp.features.compose.ui;

import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;
import androidx.lifecycle.ViewModelProvider;

import com.rakmail.androidapp.databinding.ActivityComposeMailBinding;
import com.rakmail.androidapp.features.mail.model.Mail;
import com.rakmail.androidapp.features.compose.viewmodel.ComposeMailViewModel;
import com.rakmail.androidapp.features.compose.viewmodel.ComposeMailViewModelFactory;
import com.rakmail.androidapp.core.util.Resource;

public class ComposeMailActivity extends AppCompatActivity {
    public static final String EXTRA_DRAFT_ID        = "extra_draft_id";
    public static final String EXTRA_DRAFT_RECIPIENT = "extra_draft_recipient";
    public static final String EXTRA_DRAFT_SUBJECT   = "extra_draft_subject";
    public static final String EXTRA_DRAFT_BODY      = "extra_draft_body";

    private ActivityComposeMailBinding binding;
    private ComposeMailViewModel vm;
    private boolean lastWasDraft;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        binding = ActivityComposeMailBinding.inflate(getLayoutInflater());
        setContentView(binding.getRoot());

        vm = new ViewModelProvider(
            this,
            new ComposeMailViewModelFactory()
        ).get(ComposeMailViewModel.class);

        // Prefill draft if editing one
        Intent in = getIntent();
        String draftId = in.getStringExtra(EXTRA_DRAFT_ID);
        if (draftId != null) {
            binding.etRecipient.setText(in.getStringExtra(EXTRA_DRAFT_RECIPIENT));
            binding.etSubject.setText(in.getStringExtra(EXTRA_DRAFT_SUBJECT));
            binding.etBody.setText(in.getStringExtra(EXTRA_DRAFT_BODY));
            vm.setDraftId(draftId);
            binding.btnDelete.setVisibility(View.VISIBLE);
        }

        // Toolbar navigation = close/save-draft
        binding.topAppBar.setNavigationOnClickListener(v -> onCloseClicked());

        // Delete draft
        binding.btnDelete.setOnClickListener(v -> {
            vm.deleteDraft();
            setResult(RESULT_CANCELED);
            finish();
        });

        // Send mail
        binding.btnSend.setOnClickListener(v -> onSendClicked());

        // Observe result (loading / success / error)
        vm.getResult().observe(this, res -> {
            if (res.status == Resource.Status.LOADING) {
                binding.progress.setVisibility(View.VISIBLE);
            } else {
                binding.progress.setVisibility(View.GONE);
                if (res.status == Resource.Status.SUCCESS) {
                    if (!lastWasDraft) {
                        setResult(RESULT_OK);
                    }
                    finish();
                } else {
                    Toast.makeText(this, res.message, Toast.LENGTH_LONG).show();
                }
            }
        });
    }

    private void onSendClicked() {
        String to   = binding.etRecipient.getText().toString().trim();
        String subj = binding.etSubject.getText().toString().trim();
        String body = binding.etBody.getText().toString().trim();
        lastWasDraft = false;
        vm.sendOrSave(new Mail(to, subj, body, false));
    }

    private void onCloseClicked() {
        boolean dirty = binding.etRecipient.length() > 0
            || binding.etSubject.length() > 0
            || binding.etBody.length() > 0;
        if (dirty) {
            lastWasDraft = true;
            vm.sendOrSave(new Mail(
                binding.etRecipient.getText().toString().trim(),
                binding.etSubject.getText().toString().trim(),
                binding.etBody.getText().toString().trim(),
                true
            ));
        } else {
            finish();
        }
    }
}
