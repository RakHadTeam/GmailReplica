package com.rakmail.androidapp.features.inbox.ui;

import android.net.Uri;
import android.os.Bundle;
import android.text.format.DateFormat;

import androidx.appcompat.app.AppCompatActivity;
import androidx.lifecycle.ViewModelProvider;

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
    private com.rakmail.androidapp.databinding.ActivityMailDetailBinding binding;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        binding = com.rakmail.androidapp.databinding.ActivityMailDetailBinding.inflate(getLayoutInflater());
        setContentView(binding.getRoot());

        // Set status bar color and icon visibility
        getWindow().setStatusBarColor(getResources().getColor(R.color.colorPrimary));
        getWindow().getDecorView().setSystemUiVisibility(0); // ensures icons are light

        vm = new ViewModelProvider(this).get(MailDetailViewModel.class);

        vm.getMail().observe(this, m -> {
            if (m == null) {
                finish();
                return;
            }

            binding.mailSubject.setText(m.getSubject() == null ? "(no subject)" : m.getSubject());
            binding.mailSender.setText(m.getSenderName() == null ? "(no sender)" : m.getSenderName() + " <" + (m.getSenderEmail() == null ? "no-email" : m.getSenderEmail()) + ">");
            // parse ISO-8601 timestamp
            String raw = m.getCreatedAt();
            Date date;
            try {
                SimpleDateFormat iso = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'", Locale.US);
                iso.setLenient(true);
                date = iso.parse(raw);
            } catch (ParseException e) {
                date = new Date(); // fallback to now
            }
            binding.mailDate.setText(DateFormat.format("dd MMM yyyy  HH:mm", date));
            binding.mailBody.setText(m.getBody() == null ? "" : m.getBody());
            // Profile picture
            if (m.getSenderPicture() != null && !m.getSenderPicture().isEmpty()) {
                try {
                    Uri uri = Uri.parse(m.getSenderPicture());
                    binding.mailProfilePicture.setImageURI(uri);
                } catch (Exception e) {
                    binding.mailProfilePicture.setImageResource(R.drawable.ic_account_circle);
                }
            } else {
                binding.mailProfilePicture.setImageResource(R.drawable.ic_account_circle);
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

        binding.toolbar.setNavigationOnClickListener(v -> finish());
    }




}
