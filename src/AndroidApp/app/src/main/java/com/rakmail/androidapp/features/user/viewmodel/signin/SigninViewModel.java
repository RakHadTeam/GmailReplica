package com.rakmail.androidapp.features.user.viewmodel.signin;

import android.app.Application;

import androidx.annotation.NonNull;
import androidx.lifecycle.AndroidViewModel;
import androidx.lifecycle.MutableLiveData;

import com.rakmail.androidapp.core.preferences.AuthPreferences;
import com.rakmail.androidapp.features.user.data.repository.UserRepository;

/**
 * ViewModel for handling user sign-in.
 */
public class SigninViewModel extends AndroidViewModel {

    public final MutableLiveData<Boolean> success = new MutableLiveData<>();
    public final MutableLiveData<String> error = new MutableLiveData<>();

    private final UserRepository userRepository;
    private final AuthPreferences authPreferences;

    /**
     * Constructs a SigninViewModel with injected dependencies.
     *
     * @param app Application context
     */
    public SigninViewModel(@NonNull Application app) {
        super(app);
        this.userRepository = UserRepository.getInstance();
        this.authPreferences = AuthPreferences.getInstance();
    }

    /**
     * Attempts to sign in with the provided credentials.
     * Updates LiveData for success or error.
     * @param email User email
     * @param password User password
     */
    public void signIn(String email, String password) {
        userRepository.signIn(email, password, new UserRepository.SignInCallback() {
            @Override
            public void onSuccess(String jwt) {
                authPreferences.setSignedIn(true);
                if (jwt != null) {
                    authPreferences.saveJwt(jwt);
                }
                success.postValue(true);
            }

            @Override
            public void onFailure(String msg) {
                error.postValue(msg);
            }
        });
    }
}
