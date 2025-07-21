package com.rakmail.androidapp.features.launcher.ui;

import android.content.Intent;
import android.os.Build;
import android.os.Bundle;
import android.view.View;
import android.view.WindowInsetsController;
import android.widget.Button;

import androidx.appcompat.app.AppCompatActivity;

import com.rakmail.androidapp.R;
import com.rakmail.androidapp.core.prefs.AuthPreferences;
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

        // Set status bar icons to dark for visibility on light background
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.R) {
            getWindow().getInsetsController().setSystemBarsAppearance(
                WindowInsetsController.APPEARANCE_LIGHT_STATUS_BARS,
                WindowInsetsController.APPEARANCE_LIGHT_STATUS_BARS
            );
        } else {
            getWindow().getDecorView().setSystemUiVisibility(View.SYSTEM_UI_FLAG_LIGHT_STATUS_BAR);
        }

        Button btnSignIn = findViewById(R.id.signinButton);
        Button btnSignUp = findViewById(R.id.signupButton);

        btnSignIn.setOnClickListener(v ->
            startActivity(new Intent(this, SigninActivity.class)));

        btnSignUp.setOnClickListener(v ->
            startActivity(new Intent(this, SignupActivity.class)));
    }
}
