package com.rakmail.androidapp.core.preferences;

import android.content.Context;
import android.content.SharedPreferences;

public class AuthPreferences {

    private static final String PREFS_NAME = "app_prefs";
    private static final String KEY_IS_SIGNED_IN = "is_signed_in";
    private static final String KEY_ACCESS_TOKEN = "access_token";
    private static final String KEY_USER_ID = "user_id"; // optional

    private final SharedPreferences prefs;

    public AuthPreferences(Context context) {
        this.prefs = context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE);
    }

    public boolean isSignedIn() {
        return prefs.getBoolean(KEY_IS_SIGNED_IN, false);
    }

    public void setSignedIn(boolean signedIn) {
        prefs.edit().putBoolean(KEY_IS_SIGNED_IN, signedIn).apply();
    }

    public String getAccessToken() {
        return prefs.getString(KEY_ACCESS_TOKEN, null);
    }

    public void setAccessToken(String token) {
        prefs.edit().putString(KEY_ACCESS_TOKEN, token).apply();
    }

    public void clearSession() {
        prefs.edit()
            .remove(KEY_IS_SIGNED_IN)
            .remove(KEY_ACCESS_TOKEN)
            .remove(KEY_USER_ID)
            .apply();
    }

    public String getUserId() {
        return prefs.getString(KEY_USER_ID, null);
    }

    public void setUserId(String userId) {
        prefs.edit().putString(KEY_USER_ID, userId).apply();
    }
}