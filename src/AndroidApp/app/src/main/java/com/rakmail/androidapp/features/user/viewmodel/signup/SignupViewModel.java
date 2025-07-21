package com.rakmail.androidapp.features.user.viewmodel.signup;

import android.app.Application;

import androidx.annotation.NonNull;
import androidx.lifecycle.AndroidViewModel;
import androidx.lifecycle.MutableLiveData;

import com.rakmail.androidapp.core.prefs.AuthPreferences;
import com.rakmail.androidapp.features.user.data.UserRepository;
import com.rakmail.androidapp.features.user.model.User;

import java.io.File;

public class SignupViewModel extends AndroidViewModel {
    private final UserRepository userRepository;
    private final AuthPreferences authPreferences;
    public final MutableLiveData<Boolean> signupSuccess = new MutableLiveData<>();
    public final MutableLiveData<String> signupError = new MutableLiveData<>();

    public SignupViewModel(@NonNull Application application) {
        super(application);
        this.userRepository = UserRepository.getInstance();
        this.authPreferences = AuthPreferences.getInstance();
    }

    public void signup(String fullName, String email, String password, File profilePicture) {
        userRepository.signup(fullName, email, password, profilePicture, new UserRepository.SignupCallback() {
            @Override
            public void onSuccess(User user) {
                authPreferences.setSignedIn(true);
                signupSuccess.postValue(true);
            }

            @Override
            public void onFailure(String errorMessage) {
                signupError.postValue(errorMessage);
            }
        });
    }
}
