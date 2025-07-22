package com.rakmail.androidapp.features.settings.ui;

import android.app.Dialog;
import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;
import android.provider.MediaStore;
import android.text.TextUtils;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.ImageView;
import android.widget.TextView;
import android.widget.Toast;

import androidx.activity.result.ActivityResultLauncher;
import androidx.activity.result.contract.ActivityResultContracts;
import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.appcompat.app.AlertDialog;
import androidx.appcompat.app.AppCompatDelegate;
import androidx.appcompat.widget.SwitchCompat;
import androidx.fragment.app.DialogFragment;
import androidx.lifecycle.ViewModelProvider;

import com.rakmail.androidapp.R;
import com.rakmail.androidapp.core.prefs.UserPreferences;
import com.rakmail.androidapp.features.settings.viewmodel.SettingsViewModel;

/**
 * DialogFragment for user settings, including profile and blacklist management.
 */
public class SettingsFragment extends DialogFragment {
    // UI elements
    private EditText editName;
    private ImageView imageProfile;
    private Button btnChangePicture;
    private EditText editBlacklistAddUrl;
    private Button btnAddUrl;
    private EditText editBlacklistRemoveUrl;
    private Button btnRemoveUrl;
    private Button btnSaveUser;
    private TextView textSaveError;
    private SwitchCompat switchDarkMode;
    private ActivityResultLauncher<Intent> imagePickerLauncher;

    private SettingsViewModel viewModel;

    public static SettingsFragment newInstance() {
        return new SettingsFragment();
    }

    public static void show(androidx.fragment.app.FragmentManager fm) {
        newInstance().show(fm, "settings_dialog");
    }

    @NonNull
    @Override
    public Dialog onCreateDialog(@Nullable Bundle savedInstanceState) {
        View view = requireActivity().getLayoutInflater().inflate(R.layout.fragment_settings, null);
        // Initialize UI elements
        editName = view.findViewById(R.id.editName);
        imageProfile = view.findViewById(R.id.imageProfile);
        btnChangePicture = view.findViewById(R.id.btnChangePicture);
        editBlacklistAddUrl = view.findViewById(R.id.editBlacklistAddUrl);
        btnAddUrl = view.findViewById(R.id.btnAddUrl);
        editBlacklistRemoveUrl = view.findViewById(R.id.editBlacklistRemoveUrl);
        btnRemoveUrl = view.findViewById(R.id.btnRemoveUrl);
        btnSaveUser = view.findViewById(R.id.btnSaveUser);
        textSaveError = view.findViewById(R.id.textSaveError);
        switchDarkMode = view.findViewById(R.id.switchDarkMode);

        viewModel = new ViewModelProvider(this).get(SettingsViewModel.class);

        btnChangePicture.setOnClickListener(v -> pickImage());
        btnAddUrl.setOnClickListener(v -> handleAddUrl());
        btnRemoveUrl.setOnClickListener(v -> handleRemoveUrl());
        btnSaveUser.setOnClickListener(v -> handleSaveUser());

        boolean darkModeEnabled = UserPreferences.getInstance(requireContext()).isDarkModeEnabled();
        switchDarkMode.setChecked(darkModeEnabled);
        switchDarkMode.setOnCheckedChangeListener((buttonView, isChecked) -> {
            UserPreferences.getInstance(requireContext()).setDarkModeEnabled(isChecked);
            AppCompatDelegate.setDefaultNightMode(isChecked ? AppCompatDelegate.MODE_NIGHT_YES : AppCompatDelegate.MODE_NIGHT_NO);
        });

        imagePickerLauncher = registerForActivityResult(
            new ActivityResultContracts.StartActivityForResult(),
            result -> {
                if (result.getResultCode() == android.app.Activity.RESULT_OK && result.getData() != null) {
                    Uri uri = result.getData().getData();
                    imageProfile.setImageURI(uri);
                    imageProfile.setTag(uri);
                }
            }
        );

        return new AlertDialog.Builder(requireContext())
            .setTitle("Settings")
            .setView(view)
            .setNegativeButton("Close", (dialog, which) -> dismiss())
            .create();
    }

    @Override
    public void onViewCreated(@NonNull View view, @Nullable Bundle savedInstanceState) {
        super.onViewCreated(view, savedInstanceState);
        viewModel.getUserName().observe(getViewLifecycleOwner(), name -> editName.setText(name));
        viewModel.getProfilePictureUri().observe(getViewLifecycleOwner(), uri -> {
            if (uri != null) imageProfile.setImageURI(uri);
        });
        viewModel.getIsSaving().observe(getViewLifecycleOwner(), isSaving -> {
            btnSaveUser.setEnabled(!isSaving);
            if (!isSaving && textSaveError.getVisibility() == View.GONE) {
                dismiss();
            }
        });
        viewModel.getSaveError().observe(getViewLifecycleOwner(), error -> {
            if (error != null && !error.isEmpty()) {
                textSaveError.setText(error);
                textSaveError.setVisibility(View.VISIBLE);
            } else {
                textSaveError.setVisibility(View.GONE);
            }
        });
    }

    private void pickImage() {
        Intent intent = new Intent(Intent.ACTION_PICK, MediaStore.Images.Media.EXTERNAL_CONTENT_URI);
        imagePickerLauncher.launch(intent);
    }

    private void handleAddUrl() {
        String url = editBlacklistAddUrl.getText().toString().trim();
        if (!TextUtils.isEmpty(url)) {
            viewModel.addBlacklistUrl(url, success -> {
                Toast.makeText(requireContext(), success ? url + " added to blacklist" : "Failed to add " + url + " to blacklist", Toast.LENGTH_SHORT).show();
            });
            editBlacklistAddUrl.setText("");
        } else {
            Toast.makeText(requireContext(), "Enter a URL to add", Toast.LENGTH_SHORT).show();
        }
    }

    private void handleRemoveUrl() {
        String url = editBlacklistRemoveUrl.getText().toString().trim();
        if (!TextUtils.isEmpty(url)) {
            viewModel.removeBlacklistUrl(url, success -> {
                Toast.makeText(requireContext(), success ? url + " removed from blacklist" : "Failed to remove " + url + " from blacklist", Toast.LENGTH_SHORT).show();
            });
            editBlacklistRemoveUrl.setText("");
        } else {
            Toast.makeText(requireContext(), "Enter a URL to remove", Toast.LENGTH_SHORT).show();
        }
    }

    private void handleSaveUser() {
        String newName = editName.getText().toString().trim();
        Uri newPicture = (imageProfile.getTag() instanceof Uri) ? (Uri) imageProfile.getTag() : viewModel.getProfilePictureUri().getValue();
        boolean nameChanged = !TextUtils.isEmpty(newName) && !newName.equals(viewModel.getUserName().getValue());
        boolean pictureChanged = newPicture != null && !newPicture.equals(viewModel.getProfilePictureUri().getValue());
        if (nameChanged || pictureChanged) {
            viewModel.saveUserSettings(newName, newPicture, requireContext());
            Toast.makeText(requireContext(), "Saving user settings...", Toast.LENGTH_SHORT).show();
        } else {
            Toast.makeText(requireContext(), "No changes to save", Toast.LENGTH_SHORT).show();
        }
    }
}
