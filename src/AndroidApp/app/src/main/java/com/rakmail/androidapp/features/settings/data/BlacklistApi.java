package com.rakmail.androidapp.features.settings.data;

import java.util.Map;

import retrofit2.Call;
import retrofit2.http.Body;
import retrofit2.http.DELETE;
import retrofit2.http.POST;
import retrofit2.http.Path;

/**
 * API for managing the blacklist URLs.
 */
public interface BlacklistApi {
    /**
     * Adds a URL to the blacklist.
     * @param body Map containing the URL to add.
     * @return Call for the request.
     */
    @POST("/api/blacklist")
    Call<Void> addUrl(@Body Map<String, String> body);

    /**
     * Removes a URL from the blacklist.
     * @param url The URL to remove.
     * @return Call for the request.
     */
    @DELETE("/api/blacklist/{url}")
    Call<Void> removeUrl(@Path("url") String url);
}
