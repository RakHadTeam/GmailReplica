package com.rakmail.androidapp;

import android.app.Application;

import com.rakmail.androidapp.core.preferences.AuthPreferences;

public class App extends Application {

    @Override
    public void onCreate() {
        super.onCreate();

        AuthPreferences.init(this);
    }

    public static AuthPreferences getAuthPreferences() {
        return AuthPreferences.getInstance();
    }
}
