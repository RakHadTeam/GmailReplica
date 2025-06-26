package com.rakmail.androidapp;

import android.app.Application;

import com.rakmail.androidapp.core.preferences.AuthPreferences;

public class App extends Application {

    private static App instance;
    private AuthPreferences authPreferences;

    public static App getInstance() {
        return instance;
    }

    public static AuthPreferences getAuthPreferences() {
        return getInstance().authPreferences;
    }

    @Override
    public void onCreate() {
        super.onCreate();
        instance = this;

        // Initialize AuthPreferences once for whole app
        authPreferences = new AuthPreferences(this);
    }
}