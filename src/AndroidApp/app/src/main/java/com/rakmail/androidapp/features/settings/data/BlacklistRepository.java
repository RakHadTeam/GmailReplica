package com.rakmail.androidapp.features.settings.data;

import android.util.Log;

import com.rakmail.androidapp.core.api.ApiClient;

import java.util.HashMap;
import java.util.Map;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

/**
 * Repository for managing blacklist operations.
 */
public class BlacklistRepository {
    private static final String TAG = "BlacklistRepository";
    private static BlacklistRepository instance;
    private final BlacklistApi api;

    private BlacklistRepository() {
        api = ApiClient.getInstance().create(BlacklistApi.class);
    }

    public static BlacklistRepository getInstance() {
        if (instance == null) {
            instance = new BlacklistRepository();
        }
        return instance;
    }

    /**
     * Adds a URL to the blacklist.
     * @param url The URL to add.
     * @param callback Callback for result.
     */
    public void addUrl(String url, BlacklistCallback callback) {
        Map<String, String> body = new HashMap<>();
        body.put("url", url);
        api.addUrl(body).enqueue(new Callback<Void>() {
            @Override
            public void onResponse(Call<Void> call, Response<Void> response) {
                boolean success = response.isSuccessful();
                Log.d(TAG, success ? "URL added: " + url : "Failed to add URL: " + url);
                if (callback != null) callback.onResult(success);
            }

            @Override
            public void onFailure(Call<Void> call, Throwable t) {
                Log.e(TAG, "Error adding URL: " + url, t);
                if (callback != null) callback.onResult(false);
            }
        });
    }

    /**
     * Removes a URL from the blacklist.
     * @param url The URL to remove.
     * @param callback Callback for result.
     */
    public void removeUrl(String url, BlacklistCallback callback) {
        api.removeUrl(url).enqueue(new Callback<Void>() {
            @Override
            public void onResponse(Call<Void> call, Response<Void> response) {
                boolean success = response.isSuccessful();
                Log.d(TAG, success ? "URL removed: " + url : "Failed to remove URL: " + url);
                if (callback != null) callback.onResult(success);
            }

            @Override
            public void onFailure(Call<Void> call, Throwable t) {
                Log.e(TAG, "Error removing URL: " + url, t);
                if (callback != null) callback.onResult(false);
            }
        });
    }

    /**
     * Callback for blacklist operations.
     */
    public interface BlacklistCallback {
        void onResult(boolean success);
    }
}
