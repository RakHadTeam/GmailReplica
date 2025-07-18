package com.rakmail.androidapp.features.user.viewmodel.signup;

import android.app.Application;
import androidx.annotation.NonNull;
import androidx.lifecycle.AndroidViewModel;
import androidx.lifecycle.MutableLiveData;
import com.rakmail.androidapp.core.preferences.AuthPreferences;
import com.rakmail.androidapp.features.user.data.repository.UserRepository;
import com.rakmail.androidapp.features.user.model.User;
import java.io.File;

public class SignupViewModel extends AndroidViewModel {

    private final UserRepository repository = new UserRepository();
    private final AuthPreferences prefs = AuthPreferences.getInstance();

    public MutableLiveData<Boolean> signupSuccess = new MutableLiveData<>();
    public MutableLiveData<String> signupError = new MutableLiveData<>();

    public SignupViewModel(@NonNull Application application) {
        super(application);
    }

    public void signup(String fullname, String email, String password, File profilePicture) {
        repository.signup(fullname, email, password, profilePicture, new UserRepository.SignupCallback() {
            @Override
            public void onSuccess(User user) {
                prefs.setSignedIn(true);
                prefs.saveUserId(user.getId());
                signupSuccess.postValue(true);
            }

            @Override
            public void onFailure(String errorMessage) {
                signupError.postValue(errorMessage);
            }
        });
    }
}
