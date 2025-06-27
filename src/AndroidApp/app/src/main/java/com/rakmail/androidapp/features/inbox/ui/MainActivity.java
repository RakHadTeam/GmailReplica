package com.rakmail.androidapp.features.inbox.ui;

import android.content.Intent;
import android.os.Bundle;
import android.view.Menu;
import android.view.MenuItem;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;
import androidx.appcompat.widget.Toolbar;

import com.rakmail.androidapp.App;
import com.rakmail.androidapp.R;
import com.rakmail.androidapp.core.preferences.AuthPreferences;
import com.rakmail.androidapp.features.launcher.ui.LauncherActivity;
import com.rakmail.androidapp.features.user.ui.signin.SigninActivity;

public class MainActivity extends AppCompatActivity {

    private AuthPreferences authPrefs;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        Toolbar toolbar = findViewById(R.id.toolbar);
        setSupportActionBar(toolbar);

        // Use global AuthPreferences instance from App class
        authPrefs = App.getAuthPreferences();
    }

    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        getMenuInflater().inflate(R.menu.top_menu, menu);
        return true;
    }

    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        if (item.getItemId() == R.id.action_logout) {
            Toast.makeText(this, "Logging out...", Toast.LENGTH_SHORT).show();

            authPrefs.clearSession();

            Intent intent = new Intent(this, LauncherActivity.class);
            startActivity(intent);
            finish();
            return true;
        }

        return super.onOptionsItemSelected(item);
    }
}