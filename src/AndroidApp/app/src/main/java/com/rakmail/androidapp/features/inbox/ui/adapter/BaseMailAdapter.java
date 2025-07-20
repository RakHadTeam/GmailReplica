package com.rakmail.androidapp.features.inbox.ui.adapter;

import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.os.Handler;
import android.os.Looper;
import android.widget.ImageView;

import androidx.recyclerview.widget.RecyclerView;

import com.rakmail.androidapp.R;
import com.rakmail.androidapp.core.util.BitmapUtils;
import com.rakmail.androidapp.features.inbox.model.Mail;

import java.net.HttpURLConnection;
import java.net.URL;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

public abstract class BaseMailAdapter<VH extends RecyclerView.ViewHolder> extends RecyclerView.Adapter<VH> {
    protected static final String BASE_IMAGE_URL = "http://10.0.2.2:80/";
    protected final List<Mail> items = new ArrayList<>();
    protected final Set<String> selectedIds = new HashSet<>();
    protected OnSelectionChangeListener selListener;
    protected OnDeleteMailListener delListener;

    public void setMails(List<Mail> mails) {
        items.clear();
        items.addAll(mails);
        selectedIds.clear();
        notifyDataSetChanged();
        if (selListener != null) selListener.onSelectionChanged(selectedIds);
    }

    public void setOnSelectionChangeListener(OnSelectionChangeListener l) {
        selListener = l;
    }

    public void setOnDeleteMailListener(OnDeleteMailListener l) {
        delListener = l;
    }

    public void clearSelection() {
        toggleSelection(null, null, true);
    }

    public void deleteSelected() {
        if (delListener != null) {
            for (String id : selectedIds) delListener.onDelete(id);
        }
        items.removeIf(m -> selectedIds.contains(m.getId()));
        clearSelection();
    }

    public void markSelected() {
        for (Mail m : items)
            if (selectedIds.contains(m.getId())) m.setSubject("★ " + m.getSubject());
        clearSelection();
    }

    public Set<String> getSelectedMailIds() {
        return new HashSet<>(selectedIds);
    }

    protected void toggleSelection(Mail m, RecyclerView.ViewHolder h, boolean clearAll) {
        if (clearAll) {
            selectedIds.clear();
            notifyDataSetChanged();
        } else if (m != null) {
            if (!selectedIds.remove(m.getId())) selectedIds.add(m.getId());
            notifyItemChanged(h.getAdapterPosition());
        }
        if (selListener != null) selListener.onSelectionChanged(selectedIds);
    }

    // Utility for loading images
    protected void loadSenderImage(String picturePath, ImageView avatar) {
        if (picturePath != null && !picturePath.isEmpty()) {
            avatar.setImageResource(R.drawable.ic_account_circle);
            new Thread(() -> {
                try {
                    String fullUrl = picturePath.startsWith("http") ? picturePath : BASE_IMAGE_URL + picturePath;
                    URL url = new URL(fullUrl);
                    HttpURLConnection conn = (HttpURLConnection) url.openConnection();
                    conn.setDoInput(true);
                    conn.connect();
                    Bitmap bmp = BitmapFactory.decodeStream(conn.getInputStream());
                    Bitmap roundedBmp = BitmapUtils.getCircularBitmap(bmp);
                    new Handler(Looper.getMainLooper()).post(() -> avatar.setImageBitmap(roundedBmp));
                } catch (Exception e) {
                    new Handler(Looper.getMainLooper()).post(() -> avatar.setImageResource(R.drawable.ic_account_circle));
                }
            }).start();
        } else {
            avatar.setImageResource(R.drawable.ic_account_circle);
        }
    }

    public boolean isSelected(String mailId) {
        return selectedIds.contains(mailId);
    }

    public interface OnSelectionChangeListener {
        void onSelectionChanged(Set<String> ids);
    }

    public interface OnDeleteMailListener {
        void onDelete(String mailId);
    }
}
