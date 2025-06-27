package com.rakmail.androidapp.core.api;

import com.rakmail.androidapp.features.user.model.SigninRequest;
import com.rakmail.androidapp.features.user.model.TokenResponse;
import com.rakmail.androidapp.features.user.model.User;

import okhttp3.MultipartBody;
import okhttp3.RequestBody;
import retrofit2.Call;
import retrofit2.http.Body;
import retrofit2.http.Multipart;
import retrofit2.http.POST;
import retrofit2.http.Part;

public interface UserApi {

    @Multipart
    @POST("/api/users")
    Call<User> signup(
        @Part("fullname") RequestBody fullname,
        @Part("email")    RequestBody email,
        @Part("password") RequestBody password,
        @Part MultipartBody.Part picture
    );

    @POST("/api/tokens")
    Call<TokenResponse> signIn(@Body SigninRequest body);
}
