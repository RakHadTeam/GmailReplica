package com.rakmail.androidapp.core.auth;

import android.content.Context;

import androidx.lifecycle.LifecycleOwner;
import androidx.lifecycle.MutableLiveData;
import androidx.lifecycle.ViewModel;

public class AuthEventViewModel extends ViewModel {
    public final MutableLiveData<Boolean> unauthorizedEvent = new MutableLiveData<>();

    public AuthEventViewModel() {
        AuthPreferences.setUnauthorizedListener(() -> unauthorizedEvent.postValue(true));
    }

    public void observeUnauthorizedEvent(Context context, LifecycleOwner lifecycleOwner) {
        unauthorizedEvent.observe(lifecycleOwner, unauthorized -> {
            if (Boolean.TRUE.equals(unauthorized)) {
                AuthPreferences.getInstance().clearSession();
                android.content.Intent intent = new android.content.Intent(context, com.rakmail.androidapp.features.launcher.ui.LauncherActivity.class);
                intent.setFlags(android.content.Intent.FLAG_ACTIVITY_NEW_TASK | android.content.Intent.FLAG_ACTIVITY_CLEAR_TASK);
                context.startActivity(intent);
                if (context instanceof androidx.fragment.app.FragmentActivity) {
                    ((androidx.fragment.app.FragmentActivity) context).finish();
                }
            }
        });
    }
}
