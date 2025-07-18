package com.rakmail.androidapp.features.user.viewmodel.signin;

import android.app.Application;
import androidx.annotation.NonNull;
import androidx.lifecycle.AndroidViewModel;
import androidx.lifecycle.MutableLiveData;
import com.rakmail.androidapp.core.preferences.AuthPreferences;
import com.rakmail.androidapp.core.util.JwtUtils;
import com.rakmail.androidapp.features.user.data.repository.UserRepository;

public class SigninViewModel extends AndroidViewModel {

    public final MutableLiveData<Boolean> success = new MutableLiveData<>();
    public final MutableLiveData<String> error = new MutableLiveData<>();

    private final UserRepository repo = new UserRepository();
    private final AuthPreferences prefs = AuthPreferences.getInstance();

    public SigninViewModel(@NonNull Application app) {
        super(app);
    }

    public void signIn(String email, String password) {
        repo.signIn(email, password, new UserRepository.SignInCallback() {
            @Override
            public void onSuccess(String jwt) {
                prefs.setSignedIn(true);
                if (jwt != null) {
                    prefs.saveJwt(jwt);
                    String uid = JwtUtils.getUserId(jwt);
                    if (uid != null) prefs.saveUserId(uid);
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
