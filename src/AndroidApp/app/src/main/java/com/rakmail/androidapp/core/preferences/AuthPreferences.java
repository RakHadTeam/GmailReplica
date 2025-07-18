package com.rakmail.androidapp.core.preferences;

import android.content.Context;
import android.content.SharedPreferences;

public class AuthPreferences {

    private static final String PREFS_NAME = "app_prefs";
    private static final String KEY_IS_SIGNED = "is_signed_in";
    private static final String KEY_ACCESS_JWT = "access_token";
    private static final String KEY_USER_ID = "user_id";

    private static AuthPreferences instance;

    public static void init(Context ctx) {
        if (instance == null) instance = new AuthPreferences(ctx);
    }

    public static AuthPreferences getInstance() {
        return instance;
    }

    private final SharedPreferences prefs;

    private AuthPreferences(Context ctx) {
        prefs = ctx.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE);
    }

    public boolean isSignedIn() {
        return prefs.getBoolean(KEY_IS_SIGNED, false);
    }

    public String getJwt() {
        return prefs.getString(KEY_ACCESS_JWT, null);
    }

    public String getUserId() {
        return prefs.getString(KEY_USER_ID, null);
    }

    public void setSignedIn(boolean b) {
        prefs.edit().putBoolean(KEY_IS_SIGNED, b).apply();
    }

    public void saveJwt(String jwt) {
        prefs.edit().putString(KEY_ACCESS_JWT, jwt).apply();
    }

    public void saveUserId(String id) {
        prefs.edit().putString(KEY_USER_ID, id).apply();
    }

    public void clear() {
        prefs.edit().clear().apply();
    }

    public void clearSession() {
        clear();
    }
}
