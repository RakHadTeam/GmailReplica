package com.rakmail.androidapp.features.settings.viewmodel;

import android.net.Uri;
import android.util.Log;

import androidx.lifecycle.LiveData;
import androidx.lifecycle.MutableLiveData;
import androidx.lifecycle.ViewModel;

import com.rakmail.androidapp.core.prefs.AuthPreferences;
import com.rakmail.androidapp.features.settings.data.BlacklistRepository;
import com.rakmail.androidapp.features.user.data.UserRepository;

/**
 * ViewModel for managing user settings and blacklist operations.
 */
public class SettingsViewModel extends ViewModel {
    // LiveData fields
    private final MutableLiveData<String> userName = new MutableLiveData<>("");
    private final MutableLiveData<Uri> profilePictureUri = new MutableLiveData<>();
    private final MutableLiveData<Boolean> isSaving = new MutableLiveData<>(false);
    private final MutableLiveData<String> saveError = new MutableLiveData<>("");

    // Repositories
    private final BlacklistRepository blacklistRepository = BlacklistRepository.getInstance();
    private final UserRepository userRepository = UserRepository.getInstance();
    private final AuthPreferences authPreferences = AuthPreferences.getInstance();

    public LiveData<String> getUserName() {
        return userName;
    }

    public LiveData<Uri> getProfilePictureUri() {
        return profilePictureUri;
    }

    public LiveData<Boolean> getIsSaving() {
        return isSaving;
    }

    public LiveData<String> getSaveError() {
        return saveError;
    }

    /**
     * Saves user settings (name and profile image).
     */
    public void saveUserSettings(String newName, Uri profileImageUri, android.content.Context context) {
        isSaving.setValue(true);
        saveError.setValue("");
        new Thread(() -> {
            String userId = userRepository.getUserId();
            Log.d("SettingsViewModel", "USERID: " + userId + " Saving user settings: name=" + newName + ", imageUri=" + profileImageUri);
            if (userId == null) {
                isSaving.postValue(false);
                saveError.postValue("Failed to get userId");
                return;
            }
            userRepository.updateUserProfile(context, userId, newName, profileImageUri, new UserRepository.UpdateUserCallback() {
                @Override
                public void onSuccess() {
                    isSaving.postValue(false);
                    saveError.postValue("");
                }

                @Override
                public void onFailure(String error) {
                    isSaving.postValue(false);
                    saveError.postValue(error != null ? error : "Failed to update settings");
                }
            });
        }).start();
    }

    /**
     * Adds a URL to the blacklist.
     */
    public void addBlacklistUrl(String url, BlacklistRepository.BlacklistCallback callback) {
        blacklistRepository.addUrl(url, callback);
    }

    /**
     * Removes a URL from the blacklist.
     */
    public void removeBlacklistUrl(String url, BlacklistRepository.BlacklistCallback callback) {
        blacklistRepository.removeUrl(url, callback);
    }
}
