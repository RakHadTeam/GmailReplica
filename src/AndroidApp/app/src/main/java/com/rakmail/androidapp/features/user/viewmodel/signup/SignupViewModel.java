package com.rakmail.androidapp.features.user.viewmodel.signup;

import android.app.Application;

import androidx.annotation.NonNull;
import androidx.lifecycle.AndroidViewModel;
import androidx.lifecycle.MutableLiveData;

import com.rakmail.androidapp.core.auth.AuthPreferences;
import com.rakmail.androidapp.features.user.data.UserRepository;
import com.rakmail.androidapp.features.user.model.User;

import java.io.File;

public class SignupViewModel extends AndroidViewModel {

    private final UserRepository repository;
    private final AuthPreferences prefs;

    public MutableLiveData<Boolean> signupSuccess = new MutableLiveData<>();
    public MutableLiveData<String> signupError = new MutableLiveData<>();

    public SignupViewModel(@NonNull Application application) {
        super(application);
        this.repository = UserRepository.getInstance();
        this.prefs = AuthPreferences.getInstance();
    }

    public void signup(String fullname, String email, String password, File profilePicture) {
        repository.signup(fullname, email, password, profilePicture, new UserRepository.SignupCallback() {
            @Override
            public void onSuccess(User user) {
                prefs.setSignedIn(true);
                signupSuccess.postValue(true);
            }

            @Override
            public void onFailure(String errorMessage) {
                signupError.postValue(errorMessage);
            }
        });
    }
}
