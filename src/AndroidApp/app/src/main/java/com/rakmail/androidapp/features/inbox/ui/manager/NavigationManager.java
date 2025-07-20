package com.rakmail.androidapp.features.inbox.ui.manager;

import android.content.Context;

import androidx.appcompat.app.ActionBarDrawerToggle;
import androidx.core.view.GravityCompat;

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
        if (context instanceof androidx.appcompat.app.AppCompatActivity) {
            ((androidx.appcompat.app.AppCompatActivity) context).setSupportActionBar(binding.toolbar);
            if (((androidx.appcompat.app.AppCompatActivity) context).getSupportActionBar() != null) {
                ((androidx.appcompat.app.AppCompatActivity) context).getSupportActionBar().setDisplayHomeAsUpEnabled(true);
                ((androidx.appcompat.app.AppCompatActivity) context).getSupportActionBar().setHomeButtonEnabled(true);
            }
        }
    }

    public void setOnLabelSelectedListener(OnLabelSelectedListener listener) {
        this.labelSelectedListener = listener;
    }

    public void setupNavigationDrawer() {
        ActionBarDrawerToggle toggle = new ActionBarDrawerToggle(
            (androidx.appcompat.app.AppCompatActivity) context, binding.drawerLayout, binding.toolbar,
            com.rakmail.androidapp.R.string.open_drawer, com.rakmail.androidapp.R.string.close_drawer);
        binding.drawerLayout.addDrawerListener(toggle);
        toggle.syncState();

        binding.navView.setNavigationItemSelectedListener(item -> {
            binding.drawerLayout.closeDrawer(GravityCompat.START);
            boolean handled = labelDrawerManager.handleNavigationItemSelected(item);
            if (handled && labelSelectedListener != null) {
                labelSelectedListener.onLabelSelected(item.getTitle().toString());
            }
            return handled;
        });
    }

    public interface OnLabelSelectedListener {
        void onLabelSelected(String labelTitle);
    }
}
