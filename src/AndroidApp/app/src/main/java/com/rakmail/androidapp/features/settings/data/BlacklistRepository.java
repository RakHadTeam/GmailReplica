package com.rakmail.androidapp.features.settings.data;

import android.util.Log;

import com.rakmail.androidapp.core.api.ApiClient;

import java.util.HashMap;
import java.util.Map;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class BlacklistRepository {
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

    public void addUrl(String url, BlacklistCallback callback) {
        Map<String, String> body = new HashMap<>();
        body.put("url", url);
        api.addUrl(body).enqueue(new Callback<Void>() {
            @Override
            public void onResponse(Call<Void> call, Response<Void> response) {
                boolean success = response.isSuccessful();
                Log.d("BlacklistRepo", (success ? "URL added to blacklist: " : "Failed to add URL: ") + url);
                if (callback != null) callback.onResult(success);
            }

            @Override
            public void onFailure(Call<Void> call, Throwable t) {
                Log.e("BlacklistRepo", "Error adding URL: " + url, t);
                if (callback != null) callback.onResult(false);
            }
        });
    }

    public void removeUrl(String url, BlacklistCallback callback) {
        api.removeUrl(url).enqueue(new Callback<Void>() {
            @Override
            public void onResponse(Call<Void> call, Response<Void> response) {
                boolean success = response.isSuccessful();
                Log.d("BlacklistRepo", (success ? "URL removed from blacklist: " : "Failed to remove URL: ") + url);
                if (callback != null) callback.onResult(success);
            }

            @Override
            public void onFailure(Call<Void> call, Throwable t) {
                Log.e("BlacklistRepo", "Error removing URL: " + url, t);
                if (callback != null) callback.onResult(false);
            }
        });
    }

    public interface BlacklistCallback {
        void onResult(boolean success);
    }
}
