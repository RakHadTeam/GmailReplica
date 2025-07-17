package com.rakmail.androidapp.features.inbox.ui;

import android.net.Uri;
import android.os.Bundle;
import android.text.format.DateFormat;
import android.widget.ImageView;
import android.widget.TextView;

import androidx.appcompat.app.AppCompatActivity;
import androidx.lifecycle.ViewModelProvider;

import com.google.android.material.appbar.MaterialToolbar;
import com.rakmail.androidapp.R;
import com.rakmail.androidapp.features.inbox.model.Mail;
import com.rakmail.androidapp.features.inbox.viewmodel.MailDetailViewModel;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Locale;

public class MailDetailActivity extends AppCompatActivity {

    public static final String EXTRA_MAIL = "extra_mail";
    private MailDetailViewModel vm;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_mail_detail);

        MaterialToolbar tb = findViewById(R.id.toolbar);
        tb.setNavigationOnClickListener(v -> finish());

        TextView tvSub   = findViewById(R.id.tvSubject);
        TextView tvName  = findViewById(R.id.tvSenderName);
        TextView tvEmail = findViewById(R.id.tvSenderEmail);
        TextView tvDate  = findViewById(R.id.tvDate);
        TextView tvBody  = findViewById(R.id.tvBody);
        ImageView ivAv   = findViewById(R.id.ivAvatar);

        vm = new ViewModelProvider(this).get(MailDetailViewModel.class);

        vm.getMail().observe(this, m -> {
            if (m == null) {
                finish();
                return;
            }

            tvSub.setText(m.subject == null ? "(no subject)" : m.subject);
            tvName.setText(m.senderName == null ? "(no sender)" : m.senderName);
            tvEmail.setText("<" + (m.senderEmail == null ? "no-email" : m.senderEmail) + ">");

            // parse ISO-8601 timestamp
            String raw = m.createdAt;
            Date date;
            try {
                SimpleDateFormat iso = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'", Locale.US);
                iso.setLenient(true);
                date = iso.parse(raw);
            } catch (ParseException e) {
                date = new Date(); // fallback to now
            }
            tvDate.setText(DateFormat.format("dd MMM yyyy  HH:mm", date));

            tvBody.setText(m.body == null ? "" : m.body);

            // no-lib image load
            if (m.senderPicture != null && !m.senderPicture.isEmpty()) {
                try {
                    Uri uri = Uri.parse(m.senderPicture);
                    ivAv.setImageURI(uri);
                } catch (Exception e) {
                    ivAv.setImageResource(R.drawable.ic_account_circle);
                }
            } else {
                ivAv.setImageResource(R.drawable.ic_account_circle);
            }
        });

        // inject initial mail
        Mail in = getIntent().getParcelableExtra(EXTRA_MAIL);
        if (in != null) {
            vm.setMail(in);
        } else {
            String id = getIntent().getStringExtra("mailId");
            vm.load(id);
        }
    }




}
