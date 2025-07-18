package com.rakmail.androidapp.core.util;

import android.util.Base64;
import org.json.JSONObject;

public class JwtUtils {

    public static String getUserId(String jwt) {
        if (jwt == null) return null;
        try {
            String[] parts = jwt.split("\\.");
            if (parts.length < 2) return null;
            String payloadJson = new String(Base64.decode(parts[1], Base64.URL_SAFE));
            JSONObject obj = new JSONObject(payloadJson);
            return obj.optString("sub", null);
        } catch (Exception e) {
            return null;
        }
    }
}
