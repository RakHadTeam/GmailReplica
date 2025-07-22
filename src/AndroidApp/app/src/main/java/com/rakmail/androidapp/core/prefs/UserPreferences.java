package com.rakmail.androidapp.core.prefs;

import android.content.Context;
import android.content.SharedPreferences;
import android.preference.PreferenceManager;

public class UserPreferences {
    private static final String PREF_DARK_MODE = "dark_mode";
    private static UserPreferences instance;
    private final SharedPreferences prefs;

    private UserPreferences(Context context) {
        prefs = PreferenceManager.getDefaultSharedPreferences(context.getApplicationContext());
    }

    public static synchronized UserPreferences getInstance(Context context) {
        if (instance == null) {
            instance = new UserPreferences(context);
        }
        return instance;
    }

    public boolean isDarkModeEnabled() {
        return prefs.getBoolean(PREF_DARK_MODE, false);
    }

    public void setDarkModeEnabled(boolean enabled) {
        prefs.edit().putBoolean(PREF_DARK_MODE, enabled).apply();
    }
}

