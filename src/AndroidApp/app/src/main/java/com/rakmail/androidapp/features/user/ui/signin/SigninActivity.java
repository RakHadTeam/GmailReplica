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
    private static final String TAG = "SigninActivity";

    private SigninViewModel viewModel;
    private EditText emailInput;
    private EditText passwordInput;
    private TextView errorText;
    private Button signInButton;
    private Button returnButton;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_signin);
        getWindow().getDecorView().setSystemUiVisibility(
            android.view.View.SYSTEM_UI_FLAG_LIGHT_STATUS_BAR
        );
        emailInput = findViewById(R.id.emailEditText);
        passwordInput = findViewById(R.id.passwordEditText);
        errorText = findViewById(R.id.signinErrorText);
        signInButton = findViewById(R.id.signinButton);
        returnButton = findViewById(R.id.returnButton);
        viewModel = new ViewModelProvider(this).get(SigninViewModel.class);
        observeViewModel();
        signInButton.setOnClickListener(v -> onSignInClicked());
        returnButton.setOnClickListener(v -> finish());
    }

    private void observeViewModel() {
        viewModel.signInSuccess.observe(this, success -> {
            Log.d(TAG, "Sign-in success: " + success);
            if (Boolean.TRUE.equals(success)) {
                startActivity(new Intent(SigninActivity.this, MainActivity.class));
                finish();
            }
        });
        viewModel.signInError.observe(this, errorMsg -> {
            Log.d(TAG, "Sign-in error: " + errorMsg);
            if (!TextUtils.isEmpty(errorMsg)) {
                errorText.setText(errorMsg);
                errorText.setVisibility(View.VISIBLE);
            }
        });
    }

    private void onSignInClicked() {
        errorText.setVisibility(View.GONE);
        String email = emailInput.getText().toString().trim();
        String password = passwordInput.getText().toString();
        Log.d(TAG, "Sign-in button clicked: email=" + email);
        viewModel.signIn(email, password);
    }
}
