package com.rakmail.androidapp.features.user.data.repository;

import com.rakmail.androidapp.features.user.model.SigninRequest;
import com.rakmail.androidapp.features.user.model.TokenResponse;
import com.rakmail.androidapp.features.user.model.User;

import retrofit2.Call;
import retrofit2.http.Body;
import retrofit2.http.GET;
import retrofit2.http.POST;
import retrofit2.http.Path;

public interface UserService {

    @POST("/api/tokens")
    Call<TokenResponse> signIn(@Body SigninRequest req);
    @GET("/api/users/{id}")
    Call<User> getUserById(@Path("id") String id);
}
