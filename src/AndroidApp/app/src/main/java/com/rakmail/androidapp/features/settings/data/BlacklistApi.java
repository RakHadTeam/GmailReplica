package com.rakmail.androidapp.features.settings.data;

import java.util.Map;

import retrofit2.Call;
import retrofit2.http.Body;
import retrofit2.http.DELETE;
import retrofit2.http.POST;
import retrofit2.http.Path;

public interface BlacklistApi {
    @POST("/api/blacklist")
    Call<Void> addUrl(@Body Map<String, String> body);

    @DELETE("/api/blacklist/{url}")
    Call<Void> removeUrl(@Path("url") String url);
}

