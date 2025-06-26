package com.rakmail.androidapp.features.user.data.repository;

import androidx.annotation.NonNull;

import com.rakmail.androidapp.core.api.RetrofitClient;
import com.rakmail.androidapp.core.api.UserApi;
import com.rakmail.androidapp.features.user.model.User;

import java.io.File;

import okhttp3.MediaType;
import okhttp3.MultipartBody;
import okhttp3.RequestBody;
import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class UserRepository {
    private final UserApi userApi;

    public UserRepository() {
        userApi = RetrofitClient.getInstance().create(UserApi.class);
    }

    public void signup(String fullname, String email, String password, File profileImageFile, SignupCallback callback) {
        MultipartBody.Part imagePart = null;
        if (profileImageFile != null) {
            RequestBody fileReqBody = RequestBody.create(MediaType.parse("image/*"), profileImageFile);
            imagePart = MultipartBody.Part.createFormData("picture", profileImageFile.getName(), fileReqBody);
        }

        RequestBody fullnameBody = RequestBody.create(MediaType.parse("text/plain"), fullname);
        RequestBody emailBody = RequestBody.create(MediaType.parse("text/plain"), email);
        RequestBody passwordBody = RequestBody.create(MediaType.parse("text/plain"), password);

        userApi.signup(fullnameBody, emailBody, passwordBody, imagePart).enqueue(new Callback<>() {
            @Override
            public void onResponse(@NonNull Call<User> call, @NonNull Response<User> response) {
                if (response.isSuccessful() && response.body() != null) {
                    callback.onSuccess(response.body());
                } else {
                    callback.onFailure("Signup failed: " + response.message());
                }
            }

            @Override
            public void onFailure(@NonNull Call<User> call, @NonNull Throwable t) {
                callback.onFailure("Network error: " + t.getMessage());
            }
        });
    }

    public interface SignupCallback {
        void onSuccess(User user);

        void onFailure(String errorMessage);
    }
}