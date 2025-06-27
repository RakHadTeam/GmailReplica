package com.rakmail.androidapp.features.user.ui.signin;

import android.content.Intent;
import android.os.Bundle;
import android.text.TextUtils;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.TextView;

import androidx.appcompat.app.AppCompatActivity;
import androidx.lifecycle.ViewModelProvider;

import com.rakmail.androidapp.R;
import com.rakmail.androidapp.features.inbox.ui.MainActivity;
import com.rakmail.androidapp.features.user.viewmodel.SignInViewModel;

public class SignInActivity extends AppCompatActivity {

    private SignInViewModel vm;

    @Override
    protected void onCreate(Bundle s) {
        super.onCreate(s);
        setContentView(R.layout.activity_signin);

        EditText email   = findViewById(R.id.emailInput);
        EditText pwd     = findViewById(R.id.passwordInput);
        TextView errText = findViewById(R.id.errorText);
        Button   btn     = findViewById(R.id.signInButton);

        vm = new ViewModelProvider(this).get(SignInViewModel.class);

        btn.setOnClickListener(v -> {
            errText.setVisibility(View.GONE);
            vm.signIn(
                email.getText().toString().trim(),
                pwd.getText().toString()
            );
        });

        vm.success.observe(this, ok -> {
            if (Boolean.TRUE.equals(ok)) {
                startActivity(new Intent(this, MainActivity.class));
                finish();
            }
        });

        vm.error.observe(this, msg -> {
            if (!TextUtils.isEmpty(msg)) {
                errText.setText(msg);
                errText.setVisibility(View.VISIBLE);
            }
        });
    }
}
