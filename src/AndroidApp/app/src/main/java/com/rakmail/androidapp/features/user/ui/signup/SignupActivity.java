package com.rakmail.androidapp.features.user.ui.signup;

import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;
import android.widget.Button;
import android.widget.EditText;
import android.widget.ImageView;
import android.widget.Toast;

import androidx.activity.result.ActivityResultLauncher;
import androidx.activity.result.contract.ActivityResultContracts;
import androidx.appcompat.app.AppCompatActivity;
import androidx.lifecycle.ViewModelProvider;

import com.rakmail.androidapp.R;
import com.rakmail.androidapp.features.inbox.ui.MainActivity;
import com.rakmail.androidapp.features.user.ui.signin.SigninActivity;
import com.rakmail.androidapp.features.user.viewmodel.signup.SignupViewModel;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;

public class SignupActivity extends AppCompatActivity {
    private EditText firstNameInput;
    private EditText surnameInput;
    private EditText emailInput;
    private EditText passwordInput;
    private Button signupButton;
    private Button selectImageButton;
    private Button returnButton;
    private ImageView profileImageView;
    private SignupViewModel viewModel;
    private Uri selectedImageUri = null;

    private final ActivityResultLauncher<String> imagePickerLauncher =
        registerForActivityResult(new ActivityResultContracts.GetContent(), uri -> {
            if (uri != null) {
                selectedImageUri = uri;
                profileImageView.setImageURI(uri);
            }
        });

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_signup);
        getWindow().getDecorView().setSystemUiVisibility(
            android.view.View.SYSTEM_UI_FLAG_LIGHT_STATUS_BAR
        );
        firstNameInput = findViewById(R.id.firstNameEditText);
        surnameInput = findViewById(R.id.surnameEditText);
        emailInput = findViewById(R.id.emailEditText);
        passwordInput = findViewById(R.id.passwordEditText);
        signupButton = findViewById(R.id.signupButton);
        selectImageButton = findViewById(R.id.selectImageButton);
        profileImageView = findViewById(R.id.profileImageView);
        returnButton = findViewById(R.id.returnButton);
        viewModel = new ViewModelProvider(this).get(SignupViewModel.class);
        selectImageButton.setOnClickListener(v -> imagePickerLauncher.launch("image/*"));
        signupButton.setOnClickListener(v -> handleSignup());
        returnButton.setOnClickListener(v -> finish());
        observeViewModel();
    }

    private void handleSignup() {
        String firstName = firstNameInput.getText().toString().trim();
        String surname = surnameInput.getText().toString().trim();
        String email = emailInput.getText().toString().trim();
        String password = passwordInput.getText().toString();

        if (firstName.isEmpty() || surname.isEmpty() || email.isEmpty() || password.isEmpty()) {
            Toast.makeText(this, "All fields are required", Toast.LENGTH_SHORT).show();
            return;
        }

        // Validate password strength
        if (!isValidPassword(password)) {
            Toast.makeText(this, "Password must be at least 8 characters and contain both letters and numbers", Toast.LENGTH_LONG).show();
            return;
        }

        // Combine first name and surname to create full name for the backend
        String fullName = firstName + " " + surname;
        File imageFile = selectedImageUri != null ? getFileFromUri(selectedImageUri) : null;
        viewModel.signup(fullName, email, password, imageFile);
    }

    /**
     * Validates that password is at least 8 characters and contains both letters and numbers
     */
    private boolean isValidPassword(String password) {
        if (password.length() < 8) {
            return false;
        }

        boolean hasLetter = false;
        boolean hasDigit = false;

        for (char c : password.toCharArray()) {
            if (Character.isLetter(c)) {
                hasLetter = true;
            } else if (Character.isDigit(c)) {
                hasDigit = true;
            }

            // Early exit if both conditions are met
            if (hasLetter && hasDigit) {
                return true;
            }
        }

        return hasLetter && hasDigit;
    }

    private void observeViewModel() {
        viewModel.signupSuccess.observe(this, success -> {
            if (Boolean.TRUE.equals(success)) {
                startActivity(new Intent(this, SigninActivity.class));
                finish();
            }
        });

        viewModel.signupError.observe(this, error -> {
            if (error != null) {
                Toast.makeText(this, error, Toast.LENGTH_SHORT).show();
            }
        });
    }

    private File getFileFromUri(Uri uri) {
        try (InputStream inputStream = getContentResolver().openInputStream(uri)) {
            File tempFile = new File(getCacheDir(), "upload.jpg");
            try (FileOutputStream out = new FileOutputStream(tempFile)) {
                byte[] buffer = new byte[4096];
                int read;
                while (true) {
                    assert inputStream != null;
                    if ((read = inputStream.read(buffer)) == -1) break;
                    out.write(buffer, 0, read);
                }
            }
            return tempFile;
        } catch (IOException e) {
            e.printStackTrace();
            return null;
        }
    }
}