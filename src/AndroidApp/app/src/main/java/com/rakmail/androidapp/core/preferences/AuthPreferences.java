package com.rakmail.androidapp.core.preferences;

import android.content.Context;
import android.content.SharedPreferences;

/** אחראי על JWT + מצב התחברות (Singleton). */
public class AuthPreferences {

    private static final String PREFS_NAME     = "app_prefs";
    private static final String KEY_IS_SIGNED  = "is_signed_in";
    private static final String KEY_ACCESS_JWT = "access_token";

    /** INSTANCE מוחזקת ע"י האפליקציה */
    private static AuthPreferences instance;

    public static void init(Context ctx) {
        if (instance == null) instance = new AuthPreferences(ctx);
    }
    public static AuthPreferences getInstance() {
        return instance;
    }

    /* --------- non-static  --------- */
    private final SharedPreferences prefs;
    private AuthPreferences(Context ctx) {
        prefs = ctx.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE);
    }

    public boolean isSignedIn()     { return prefs.getBoolean(KEY_IS_SIGNED, false); }
    public String  getJwt()         { return prefs.getString(KEY_ACCESS_JWT, null); }

    public void setSignedIn(boolean b) { prefs.edit().putBoolean(KEY_IS_SIGNED, b).apply(); }
    public void saveJwt(String jwt)    { prefs.edit().putString(KEY_ACCESS_JWT, jwt).apply(); }

    public void clear() {
        prefs.edit().clear().apply();
    }
    public void clearSession() {
        clear();
    }
}
