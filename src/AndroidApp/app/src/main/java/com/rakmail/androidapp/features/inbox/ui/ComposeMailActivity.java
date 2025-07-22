package com.rakmail.androidapp.features.inbox.ui;

import android.content.Intent;
import android.os.Bundle;
import android.text.TextUtils;
import android.view.View;
import android.widget.ProgressBar;
import android.widget.Toast;

import androidx.annotation.Nullable;
import androidx.appcompat.app.AppCompatActivity;
import androidx.lifecycle.ViewModelProvider;

import com.google.android.material.button.MaterialButton;
import com.google.android.material.textfield.TextInputEditText;
import com.rakmail.androidapp.R;
import com.rakmail.androidapp.features.inbox.data.MailRepository;
import com.rakmail.androidapp.features.inbox.viewmodel.ComposeMailViewModel;
import com.rakmail.androidapp.features.inbox.viewmodel.ComposeMailViewModelFactory;

public class ComposeMailActivity extends AppCompatActivity {

    public static final String EXTRA_DRAFT_ID        = "draft_id";
    public static final String EXTRA_DRAFT_RECIPIENT = "draft_recipient";
    public static final String EXTRA_DRAFT_SUBJECT   = "draft_subject";
    public static final String EXTRA_DRAFT_BODY      = "draft_body";

    private ComposeMailViewModel vm;
    private TextInputEditText etRecipient, etSubject, etBody;
    private MaterialButton btnSend, btnDelete;
    private ProgressBar progress;
    private @Nullable String draftId;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_compose_mail);

        etRecipient = findViewById(R.id.et_recipient);
        etSubject   = findViewById(R.id.et_subject);
        etBody      = findViewById(R.id.et_body);
        btnSend     = findViewById(R.id.btn_send);
        btnDelete   = findViewById(R.id.btn_delete);
        progress    = findViewById(R.id.progress);

        // **Close icon saves draft if dirty**
        findViewById(R.id.btn_close)
            .setOnClickListener(v -> onBackPressed());

        // Load draft values
        Intent i = getIntent();
        draftId = i.getStringExtra(EXTRA_DRAFT_ID);
        if (draftId != null) {
            btnDelete.setVisibility(View.VISIBLE);
            etRecipient.setText(i.getStringExtra(EXTRA_DRAFT_RECIPIENT));
            etSubject.setText(i.getStringExtra(EXTRA_DRAFT_SUBJECT));
            etBody.setText(i.getStringExtra(EXTRA_DRAFT_BODY));
        }

        // ViewModel
        vm = new ViewModelProvider(this,
            new ComposeMailViewModelFactory(
                getApplication(),
                MailRepository.getInstance()
            )
        ).get(ComposeMailViewModel.class);

        vm.getResult().observe(this, res -> {
            switch (res.status) {
                case LOADING:
                    setLoading(true); break;
                case SUCCESS:
                    setLoading(false);
                    finish();      // close after successful save/send
                    break;
                case ERROR:
                    setLoading(false);
                    Toast.makeText(this,
                        "AUTH".equals(res.message)
                            ? "Please sign in again"
                            : res.message,
                        Toast.LENGTH_LONG).show();
                    break;
            }
        });

        btnSend.setOnClickListener(v -> submit(false));
        btnDelete.setOnClickListener(v -> submit(true));
    }

    /**
     * Override back‑press so that if there's any text entered we save as draft,
     * otherwise just exit immediately.
     */
    @Override
    public void onBackPressed() {
        boolean dirty = !TextUtils.isEmpty(etRecipient.getText())
            || !TextUtils.isEmpty(etSubject.getText())
            || !TextUtils.isEmpty(etBody.getText());

        if (dirty) {
            // Auto‑save as draft
            submit(true);
        } else {
            super.onBackPressed();
        }
    }

    private void submit(boolean isDraft) {
        vm.sendOrSave(
            draftId,
            getText(etRecipient),
            getText(etSubject),
            getText(etBody),
            isDraft
        );
    }

    private void setLoading(boolean loading) {
        progress.setVisibility(loading ? View.VISIBLE : View.GONE);
        btnSend.setEnabled(!loading);
        btnDelete.setEnabled(!loading);
    }

    private @Nullable String getText(TextInputEditText et) {
        String s = et.getText() == null
            ? null
            : et.getText().toString().trim();
        return TextUtils.isEmpty(s) ? null : s;
    }
}
