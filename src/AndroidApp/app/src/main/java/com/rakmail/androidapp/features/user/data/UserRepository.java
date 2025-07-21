package com.rakmail.androidapp.features.user.data;

import android.content.Context;
import android.net.Uri;
import android.util.Log;

import androidx.annotation.NonNull;

import com.rakmail.androidapp.core.api.ApiClient;
import com.rakmail.androidapp.features.user.model.SigninRequest;
import com.rakmail.androidapp.features.user.model.TokenResponse;
import com.rakmail.androidapp.features.user.model.User;

import java.io.File;
import java.io.InputStream;

import okhttp3.MediaType;
import okhttp3.MultipartBody;
import okhttp3.RequestBody;
import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class UserRepository {

    private final UserApi api;

    private static volatile UserRepository INSTANCE;

    private UserRepository() {
        api = ApiClient.getInstance().create(UserApi.class);
    }

    public static UserRepository getInstance() {
        if (INSTANCE == null) {
            synchronized (UserRepository.class) {
                if (INSTANCE == null) {
                    INSTANCE = new UserRepository();
                }
            }
        }
        return INSTANCE;
    }

    public void signup(String fullName, String email, String password, File profileImageFile, SignupCallback callback) {
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
        RequestBody fn = RequestBody.create(MediaType.parse("text/plain"), fullName);
        RequestBody em = RequestBody.create(MediaType.parse("text/plain"), email);
        RequestBody pwd = RequestBody.create(MediaType.parse("text/plain"), password);

        api.signup(fn, em, pwd, imagePart).enqueue(new Callback<>() {
            @Override public void onResponse(@NonNull Call<User> c,
                                             @NonNull Response<User> r) {
                if (r.isSuccessful() && r.body() != null)
                    callback.onSuccess(r.body());
                else
                    callback.onFailure("Signup failed: " + r.code());
            }
            @Override public void onFailure(@NonNull Call<User> c,
                                            @NonNull Throwable t) {
                callback.onFailure(t.getMessage());
            }
        });
    }

    public void signIn(String email, String password, SignInCallback callback) {
        SigninRequest request = new SigninRequest(email, password);

        api.signIn(request).enqueue(new Callback<>() {
            @Override public void onResponse(@NonNull Call<TokenResponse> c,
                                             @NonNull Response<TokenResponse> r) {
                if (r.isSuccessful() && r.body() != null)
                    callback.onSuccess(r.body().getToken());
                else
                    callback.onFailure("Login failed: " + r.code());
            }
            @Override public void onFailure(@NonNull Call<TokenResponse> c,
                                            @NonNull Throwable t) {
                callback.onFailure(t.getMessage());
            }
        });
    }

    public void getUserById(String userId, GetUserCallback cb) {
        api.getUserById(userId).enqueue(new Callback<>() {
            @Override public void onResponse(@NonNull Call<User> call,
                                             @NonNull Response<User> response) {
                if (response.isSuccessful() && response.body() != null) {
                    Log.d("USERREPO", "Fetched user: " + response.body());
                    cb.onSuccess(response.body());
                } else {
                    cb.onFailure("Failed to fetch user: " + response.code());
                }
            }

            @Override public void onFailure(@NonNull Call<User> call,
                                            @NonNull Throwable t) {
                cb.onFailure(t.getMessage());
            }
        });
    }

    public void updateUserProfile(Context context, String userId, String newName, Uri profileImageUri, UpdateUserCallback cb) {
        RequestBody fn = RequestBody.create(MediaType.parse("text/plain"), newName);
        MultipartBody.Part imagePart = null;
        if (profileImageUri != null) {
            try {
                InputStream inputStream = context.getContentResolver().openInputStream(profileImageUri);
                String fileName = "profile_image";
                java.io.File tempFile = java.io.File.createTempFile(fileName, null, context.getCacheDir());
                java.io.FileOutputStream out = new java.io.FileOutputStream(tempFile);
                byte[] buffer = new byte[4096];
                int bytesRead;
                while ((bytesRead = inputStream.read(buffer)) != -1) {
                    out.write(buffer, 0, bytesRead);
                }
                out.close();
                inputStream.close();
                RequestBody fileBody = RequestBody.create(MediaType.parse("image/*"), tempFile);
                imagePart = MultipartBody.Part.createFormData("picture", tempFile.getName(), fileBody);
            } catch (Exception e) {
                Log.e("UserRepository", "Failed to convert Uri to File", e);
                cb.onFailure("Failed to process profile image");
                return;
            }
        }
        api.updateUserProfile(userId, fn, imagePart).enqueue(new Callback<Void>() {
            @Override
            public void onResponse(@NonNull Call<Void> call, @NonNull Response<Void> response) {
                if (response.isSuccessful()) {
                    cb.onSuccess();
                } else {
                    Log.d("USERREPO", response.message());
                    cb.onFailure("Failed to update settings: " + response.code());
                }
            }

            @Override
            public void onFailure(@NonNull Call<Void> call, @NonNull Throwable t) {
                cb.onFailure(t.getMessage());
            }
        });
    }

    /**
     * Synchronously fetches the userId string from /api/me.
     * Returns null if the request fails or userId is missing.
     */
    public String getUserId() {
        try {
            Response<okhttp3.ResponseBody> response = api.getUserId().execute();
            if (response.isSuccessful() && response.body() != null) {
                String json = response.body().string();
                org.json.JSONObject obj = new org.json.JSONObject(json);
                return obj.optString("userId", null);
            }
        } catch (Exception e) {
            Log.e("UserRepository", "Failed to get userId", e);
        }
        return null;
    }

    // Callbacks
    public interface SignupCallback {
        void onSuccess(User user);
        void onFailure(String msg);
    }

    public interface SignInCallback {
        void onSuccess(String token);
        void onFailure(String msg);
    }

    public interface GetUserCallback {
        void onSuccess(User user);
        void onFailure(String msg);
    }

    public interface UpdateUserCallback {
        void onSuccess();

        void onFailure(String error);
    }

    public interface GetUserIdCallback {
        void onSuccess(String userId);

        void onFailure(String error);
    }

}
