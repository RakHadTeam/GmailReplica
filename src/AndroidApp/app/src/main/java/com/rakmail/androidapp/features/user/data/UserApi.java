package com.rakmail.androidapp.features.user.data;

import com.rakmail.androidapp.features.user.model.SigninRequest;
import com.rakmail.androidapp.features.user.model.TokenResponse;
import com.rakmail.androidapp.features.user.model.User;

import okhttp3.MultipartBody;
import okhttp3.RequestBody;
import okhttp3.ResponseBody;
import retrofit2.Call;
import retrofit2.http.Body;
import retrofit2.http.GET;
import retrofit2.http.Multipart;
import retrofit2.http.PATCH;
import retrofit2.http.POST;
import retrofit2.http.Part;
import retrofit2.http.Path;

public interface UserApi {
    @Multipart
    @POST("/api/users")
    Call<User> signup(
        @Part("fullname") RequestBody fullName,
        @Part("email")    RequestBody email,
        @Part("password") RequestBody password,
        @Part MultipartBody.Part picture
    );

    @POST("/api/tokens")
    Call<TokenResponse> signIn(@Body SigninRequest request);

    @GET("/api/users/{id}")
    Call<User> getUserById(@Path("id") String id);

    @Multipart
    @PATCH("/api/users/{id}")
    Call<Void> updateUserProfile(
        @Path("id") String userId,
        @Part("fullname") RequestBody fullName,
        @Part MultipartBody.Part picture
    );

    @GET("/api/me")
    Call<ResponseBody> getUserId();
}
