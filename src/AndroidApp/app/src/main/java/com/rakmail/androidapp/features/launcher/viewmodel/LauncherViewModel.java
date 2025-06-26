package com.rakmail.androidapp.features.launcher.viewmodel;

import androidx.lifecycle.LiveData;
import androidx.lifecycle.MutableLiveData;
import androidx.lifecycle.ViewModel;

import com.rakmail.androidapp.App;

public class LauncherViewModel extends ViewModel {
    private final MutableLiveData<Target> navigationTarget = new MutableLiveData<>();

    public LauncherViewModel() {

        boolean isSignedIn = App.getAuthPreferences().isSignedIn();

        navigationTarget.setValue(isSignedIn ? Target.MAIN : Target.SIGNUP);
    }

    public LiveData<Target> getNavigationTarget() {
        return navigationTarget;
    }

    public enum Target {MAIN, SIGNUP}
}