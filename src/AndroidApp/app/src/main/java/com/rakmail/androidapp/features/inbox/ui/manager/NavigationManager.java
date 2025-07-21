package com.rakmail.androidapp.features.inbox.ui.manager;

import android.content.Context;

import androidx.appcompat.app.ActionBarDrawerToggle;
import androidx.appcompat.app.AppCompatActivity;
import androidx.appcompat.widget.Toolbar;
import androidx.core.view.GravityCompat;

import com.rakmail.androidapp.R;
import com.rakmail.androidapp.databinding.ActivityMainBinding;
import com.rakmail.androidapp.features.label.view.drawer.LabelDrawerManager;

public class NavigationManager {
    private final ActivityMainBinding binding;
    private final Context context;
    private final LabelDrawerManager labelDrawerManager;
    private OnLabelSelectedListener labelSelectedListener;

    public NavigationManager(ActivityMainBinding binding, Context context, LabelDrawerManager labelDrawerManager) {
        this.binding = binding;
        this.context = context;
        this.labelDrawerManager = labelDrawerManager;
    }

    public void setupToolbar() {
        Toolbar toolbar = binding.toolbar;
        if (context instanceof AppCompatActivity) {
            ((AppCompatActivity) context).setSupportActionBar(toolbar);
        }
    }

    public void setOnLabelSelectedListener(OnLabelSelectedListener listener) {
        this.labelSelectedListener = listener;
    }

    public void setupNavigationDrawer() {
        Toolbar toolbar = binding.toolbar;
        ActionBarDrawerToggle toggle = new ActionBarDrawerToggle(
            (AppCompatActivity) context, binding.drawerLayout, toolbar,
            com.rakmail.androidapp.R.string.open_drawer, com.rakmail.androidapp.R.string.close_drawer);
        binding.drawerLayout.addDrawerListener(toggle);
        toggle.syncState();

        binding.navView.setNavigationItemSelectedListener(item -> {
            binding.drawerLayout.closeDrawer(GravityCompat.START);
            boolean handled = labelDrawerManager.onNavigationItemSelected(item);
            if (handled && labelSelectedListener != null) {
                labelSelectedListener.onLabelSelected(item.getGroupId() == R.id.group_system_labels ? item.getTitle().toString() : "Label: " + item.getTitle().toString());
            }
            return handled;
        });
    }

    public interface OnLabelSelectedListener {
        void onLabelSelected(String labelTitle);
    }
}
