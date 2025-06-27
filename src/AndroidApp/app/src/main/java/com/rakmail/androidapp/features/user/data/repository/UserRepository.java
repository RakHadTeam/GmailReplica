package com.rakmail.androidapp.features.user.data.repository;

import androidx.annotation.NonNull;

import com.rakmail.androidapp.core.network.ApiClient;
import com.rakmail.androidapp.core.api.UserApi;
import com.rakmail.androidapp.features.user.model.SignInRequest;
import com.rakmail.androidapp.features.user.model.TokenResponse;
import com.rakmail.androidapp.features.user.model.User;

import java.io.File;

import okhttp3.MediaType;
import okhttp3.MultipartBody;
import okhttp3.RequestBody;
import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class UserRepository {

    private final UserApi api;

    public UserRepository() {
        /** ←————  כאן השינוי  ————→ */
        api = ApiClient.get().create(UserApi.class);
    }

    public void signup(String fullname, String email, String password, File profileImageFile, SignupCallback cb) {

        MultipartBody.Part imagePart = null;
        if (profileImageFile != null) {
            RequestBody fileBody = RequestBody.create(
                MediaType.parse("image/*"),
                profileImageFile
            );
            imagePart = MultipartBody.Part.createFormData(
                "picture",
                profileImageFile.getName(),
                fileBody
            );
        }

        RequestBody fn = RequestBody.create(MediaType.parse("text/plain"), fullname);
        RequestBody em = RequestBody.create(MediaType.parse("text/plain"), email);
        RequestBody pwd = RequestBody.create(MediaType.parse("text/plain"), password);

        api.signup(fn, em, pwd, imagePart).enqueue(new Callback<>() {
            @Override public void onResponse(@NonNull Call<User> c,
                                             @NonNull Response<User> r) {
                if (r.isSuccessful() && r.body() != null)
                    cb.onSuccess(r.body());
                else
                    cb.onFailure("Signup failed: " + r.code());
            }
            @Override public void onFailure(@NonNull Call<User> c,
                                            @NonNull Throwable t) {
                cb.onFailure(t.getMessage());
            }
        });
    }

    public void signIn(String email, String password, SignInCallback cb) {
        SignInRequest body = new SignInRequest(email, password);

        api.signIn(body).enqueue(new Callback<>() {
            @Override public void onResponse(@NonNull Call<TokenResponse> c,
                                             @NonNull Response<TokenResponse> r) {
                if (r.isSuccessful() && r.body() != null)
                    cb.onSuccess(r.body().token);
                else
                    cb.onFailure("Login failed: " + r.code());
            }
            @Override public void onFailure(@NonNull Call<TokenResponse> c,
                                            @NonNull Throwable t) {
                cb.onFailure(t.getMessage());
            }
        });
    }

    public interface SignupCallback {
        void onSuccess(User user);
        void onFailure(String msg);
    }
    public interface SignInCallback {
        void onSuccess(String token );
        void onFailure(String msg);
    }
}
