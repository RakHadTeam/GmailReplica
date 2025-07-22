package com.rakmail.androidapp;

import android.app.Application;
import androidx.appcompat.app.AppCompatDelegate;

import com.rakmail.androidapp.core.prefs.AuthPreferences;
import com.rakmail.androidapp.core.prefs.UserPreferences;

public class App extends Application {
    @Override
    public void onCreate() {
        super.onCreate();
        AuthPreferences.init(this);
        boolean darkModeEnabled = UserPreferences.getInstance(this).isDarkModeEnabled();
        AppCompatDelegate.setDefaultNightMode(
            darkModeEnabled ? AppCompatDelegate.MODE_NIGHT_YES : AppCompatDelegate.MODE_NIGHT_NO
        );
    }

    public static AuthPreferences authPreferences() {
        return AuthPreferences.getInstance();
    }
}
