package com.rakmail.androidapp.features.user.viewmodel.signin;

import android.app.Application;

import androidx.annotation.NonNull;
import androidx.lifecycle.AndroidViewModel;
import androidx.lifecycle.MutableLiveData;

import com.rakmail.androidapp.core.prefs.AuthPreferences;
import com.rakmail.androidapp.features.user.data.UserRepository;

public class SigninViewModel extends AndroidViewModel {
    public final MutableLiveData<Boolean> signInSuccess = new MutableLiveData<>();
    public final MutableLiveData<String> signInError = new MutableLiveData<>();

    private final UserRepository userRepository;
    private final AuthPreferences authPreferences;

    public SigninViewModel(@NonNull Application app) {
        super(app);
        this.userRepository = UserRepository.getInstance();
        this.authPreferences = AuthPreferences.getInstance();
    }

    public void signIn(String email, String password) {
        userRepository.signIn(email, password, new UserRepository.SignInCallback() {
            @Override
            public void onSuccess(String jwt) {
                authPreferences.setSignedIn(true);
                if (jwt != null) {
                    authPreferences.saveJwt(jwt);
                }
                signInSuccess.postValue(true);
            }

            @Override
            public void onFailure(String msg) {
                signInError.postValue(msg);
            }
        });
    }
}
