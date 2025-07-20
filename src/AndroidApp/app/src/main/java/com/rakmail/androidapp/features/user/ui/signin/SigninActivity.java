package com.rakmail.androidapp.features.user.ui.signin;

import android.content.Intent;
import android.os.Bundle;
import android.text.TextUtils;
import android.util.Log;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.TextView;

import androidx.appcompat.app.AppCompatActivity;
import androidx.lifecycle.ViewModelProvider;

import com.rakmail.androidapp.R;
import com.rakmail.androidapp.features.inbox.ui.MainActivity;
import com.rakmail.androidapp.features.user.viewmodel.signin.SigninViewModel;

public class SigninActivity extends AppCompatActivity {
    private static final String TAG = "SigninActivity";   // ← add this

    private SigninViewModel vm;

    @Override
    protected void onCreate(Bundle s) {
        super.onCreate(s);
        setContentView(R.layout.activity_signin);

        // Set status bar icons to dark for visibility on light background
        getWindow().getDecorView().setSystemUiVisibility(
            android.view.View.SYSTEM_UI_FLAG_LIGHT_STATUS_BAR
        );

        EditText email = findViewById(R.id.emailEditText);
        EditText pwd = findViewById(R.id.passwordEditText);
        TextView errText = findViewById(R.id.signinErrorText);
        Button btn = findViewById(R.id.signinButton);
        Button btnReturn = findViewById(R.id.returnButton);

        vm = new ViewModelProvider(this).get(SigninViewModel.class);

        // Observe success/failure before the click, so we don't miss any events
        vm.success.observe(this, ok -> {
            Log.d(TAG, "vm.success fired: " + ok);
            if (Boolean.TRUE.equals(ok)) {
                Log.d(TAG, "Navigating to MainActivity");
                startActivity(new Intent(SigninActivity.this, MainActivity.class));
                finish();
            }
        });

        vm.error.observe(this, msg -> {
            Log.d(TAG, "vm.error fired: " + msg);
            if (!TextUtils.isEmpty(msg)) {
                errText.setText(msg);
                errText.setVisibility(View.VISIBLE);
            }
        });

        btn.setOnClickListener(v -> {
            errText.setVisibility(View.GONE);
            String e = email.getText().toString().trim();
            String p = pwd.getText().toString();
            Log.d(TAG, "Sign-in button clicked: email=" + e);
            vm.signIn(e, p);
        });
        btnReturn.setOnClickListener(v -> finish());
    }
}
