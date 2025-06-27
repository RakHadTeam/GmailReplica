package com.rakmail.androidapp.features.user.data.repository;

import com.rakmail.androidapp.features.user.model.SigninRequest;
import com.rakmail.androidapp.features.user.model.TokenResponse;

import retrofit2.Call;
import retrofit2.http.Body;
import retrofit2.http.POST;

public interface UserService {

    @POST("/api/tokens")
    Call<TokenResponse> signIn(@Body SigninRequest req);
}
