package com.rakmail.androidapp.features.launcher.ui;

import android.content.Intent;
import android.os.Bundle;
import android.widget.Button;

import androidx.appcompat.app.AppCompatActivity;

import com.rakmail.androidapp.R;
import com.rakmail.androidapp.core.preferences.AuthPreferences;
import com.rakmail.androidapp.features.inbox.ui.MainActivity;
import com.rakmail.androidapp.features.user.ui.signin.SigninActivity;
import com.rakmail.androidapp.features.user.ui.signup.SignupActivity;

public class LauncherActivity extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);


        if (AuthPreferences.getInstance().isSignedIn()) {
            startActivity(new Intent(this, MainActivity.class));
            finish();
            return;
        }


        setContentView(R.layout.activity_launcher);

        Button btnSignIn  = findViewById(R.id.btnSignIn);
        Button btnSignUp  = findViewById(R.id.btnSignUp);

        btnSignIn.setOnClickListener(v ->
            startActivity(new Intent(this, SigninActivity.class)));

        btnSignUp.setOnClickListener(v ->
            startActivity(new Intent(this, SignupActivity.class)));
    }
}
