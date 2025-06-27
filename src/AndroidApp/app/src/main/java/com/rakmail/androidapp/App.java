package com.rakmail.androidapp;

import android.app.Application;

import com.rakmail.androidapp.core.preferences.AuthPreferences;

public class App extends Application {

    @Override
    public void onCreate() {
        super.onCreate();

        // אתחול ה-Singleton פעם אחת עם קונטקסט האפליקציה
        AuthPreferences.init(this);
    }

    /** גישה נוחה מכל מקום */
    public static AuthPreferences getAuthPreferences() {
        return AuthPreferences.getInstance();
    }
}
