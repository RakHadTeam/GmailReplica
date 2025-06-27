package com.rakmail.androidapp.features.launcher.ui;

import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;

import androidx.appcompat.app.AppCompatActivity;

import com.rakmail.androidapp.R;
import com.rakmail.androidapp.core.preferences.AuthPreferences;
import com.rakmail.androidapp.features.inbox.ui.MainActivity;
import com.rakmail.androidapp.features.user.ui.signin.SignInActivity;
import com.rakmail.androidapp.features.user.ui.signup.SignupActivity;

/**
 * משמש כ־Splash/Router:
 * 1. אם כבר מחובר → ממשיך ל־Inbox.
 * 2. אחרת מציג שני כפתורים:  Sign In  /  Sign Up.
 */
public class LauncherActivity extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        // 1. אם יש Session שמור – נכנסים ישר
        if (AuthPreferences.getInstance().isSignedIn()) {
            startActivity(new Intent(this, MainActivity.class));
            finish();
            return;
        }

        // 2. אחרת מציגים מסך בחירה
        setContentView(R.layout.activity_launcher);

        Button btnSignIn  = findViewById(R.id.btnSignIn);
        Button btnSignUp  = findViewById(R.id.btnSignUp);

        btnSignIn.setOnClickListener(v ->
            startActivity(new Intent(this, SignInActivity.class)));

        btnSignUp.setOnClickListener(v ->
            startActivity(new Intent(this, SignupActivity.class)));
    }
}
