package com.rakmail.androidapp.features.launcher.ui;

import android.content.Intent;
import android.os.Bundle;

import androidx.appcompat.app.AppCompatActivity;
import androidx.lifecycle.ViewModelProvider;

import com.rakmail.androidapp.features.launcher.viewmodel.LauncherViewModel;
import com.rakmail.androidapp.features.user.ui.signup.SignupActivity;
import com.rakmail.androidapp.features.inbox.ui.MainActivity;

public class LauncherActivity extends AppCompatActivity {
    private LauncherViewModel viewModel;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        viewModel = new ViewModelProvider(this).get(LauncherViewModel.class);

        viewModel.getNavigationTarget().observe(this, target -> {
            if (target == LauncherViewModel.Target.MAIN) {
                startActivity(new Intent(this, MainActivity.class));
            } else {
                startActivity(new Intent(this, SignupActivity.class));
            }
            finish();
        });
    }
}