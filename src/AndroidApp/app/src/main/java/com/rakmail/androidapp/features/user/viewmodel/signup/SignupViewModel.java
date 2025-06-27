package com.rakmail.androidapp.features.user.viewmodel.signup;

import android.app.Application;
import android.content.SharedPreferences;

import androidx.annotation.NonNull;
import androidx.lifecycle.AndroidViewModel;
import androidx.lifecycle.MutableLiveData;

import com.rakmail.androidapp.features.user.model.User;
import com.rakmail.androidapp.features.user.data.repository.UserRepository;

import java.io.File;

public class SignupViewModel extends AndroidViewModel {
    private final UserRepository repository = new UserRepository();
    public MutableLiveData<Boolean> signupSuccess = new MutableLiveData<>();
    public MutableLiveData<String> signupError = new MutableLiveData<>();

    public SignupViewModel(@NonNull Application application) {
        super(application);
    }

    public void signup(String fullname, String email, String password, File profilePicture) {
        repository.signup(fullname, email, password, profilePicture, new UserRepository.SignupCallback() {
            @Override
            public void onSuccess(User user) {
                SharedPreferences.Editor editor = getApplication().getSharedPreferences("app_prefs", 0).edit();
                editor.putBoolean("is_signed_in", true);
                editor.putString("fullname", user.getFullname());
                editor.putString("email", user.getEmail());
                editor.putString("profile_url", user.getProfilePictureUrl());
                editor.apply();
                signupSuccess.postValue(true);
            }

            @Override
            public void onFailure(String errorMessage) {
                signupError.postValue(errorMessage);
            }
        });
    }
}