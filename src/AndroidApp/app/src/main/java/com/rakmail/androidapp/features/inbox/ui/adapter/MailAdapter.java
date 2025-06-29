package com.rakmail.androidapp.features.inbox.ui.adapter;

import android.content.Context;
import android.content.Intent;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.graphics.Color;
import android.os.Handler;
import android.os.Looper;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.core.content.ContextCompat;
import androidx.recyclerview.widget.RecyclerView;

import com.rakmail.androidapp.R;
import com.rakmail.androidapp.features.inbox.model.Mail;
import com.rakmail.androidapp.features.inbox.ui.MailDetailActivity;

import java.io.InputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

/**
 * RecyclerView adapter that shows mails, supports multi-select,
 * and loads the sender’s avatar without any external image library.
 */
public class MailAdapter extends RecyclerView.Adapter<MailAdapter.ViewHolder> {

    // ---------- configuration ----------
    private static final String BASE_URL = "http://10.0.2.2:3000";   // host → backend
    private static final int MAX_PREVIEW = 80;                       // chars in preview
    // -----------------------------------

    private final List<Mail> items = new ArrayList<>();
    private final Set<String> selectedIds = new HashSet<>();

    private OnSelectionChangeListener selListener;
    private OnDeleteMailListener     delListener;

    /* ---------- public API ---------- */

    public void setMails(List<Mail> mails) {
        items.clear();
        items.addAll(mails);
        selectedIds.clear();
        notifyDataSetChanged();
        if (selListener != null) selListener.onSelectionChanged(selectedIds);
    }

    public void setOnSelectionChangeListener(OnSelectionChangeListener l) { selListener = l; }
    public void setOnDeleteMailListener     (OnDeleteMailListener     l) { delListener = l; }

    public void clearSelection() { toggleSelection(null, null, true); }

    public void deleteSelected() {
        if (delListener != null) {
            for (String id : selectedIds) delListener.onDelete(id);
        }
        items.removeIf(m -> selectedIds.contains(m.id));
        clearSelection();
    }

    public void markSelected() {
        for (Mail m : items) if (selectedIds.contains(m.id)) m.subject = "★ " + m.subject;
        clearSelection();
    }

    /* ---------- adapter plumbing ---------- */

    @NonNull @Override
    public ViewHolder onCreateViewHolder(@NonNull ViewGroup p,int t) {
        View v = LayoutInflater.from(p.getContext())
            .inflate(R.layout.item_mail, p, false);   // make sure file is item_mail.xml
        return new ViewHolder(v);
    }

    @Override public int getItemCount() { return items.size(); }

    @Override
    public void onBindViewHolder(@NonNull ViewHolder holder, int position) {
        Mail m = items.get(position);
        boolean isSelected = selectedIds.contains(m.id);

        holder.subject.setText(m.subject != null ? m.subject : "(no subject)");
        holder.preview.setText(
            m.body != null && m.body.length() > 80
                ? m.body.substring(0, 80) + "…"
                : (m.body != null ? m.body : "")
        );
        holder.sender.setText(m.senderName != null ? m.senderName : "(no sender)");

        holder.itemView.setBackgroundColor(isSelected
            ? ContextCompat.getColor(holder.itemView.getContext(), R.color.teal_200)
            : Color.TRANSPARENT);

        holder.itemView.setOnClickListener(v -> {
            if (selectedIds.isEmpty()) {
                Context c = v.getContext();
                Intent i = new Intent(c, MailDetailActivity.class);
                i.putExtra(MailDetailActivity.EXTRA_MAIL, m);
                c.startActivity(i);
            } else {
                toggleSelection(m, holder, isSelected);  // Pass the isSelected boolean
            }
        });

        holder.itemView.setOnLongClickListener(v -> {
            toggleSelection(m, holder, isSelected);  // Pass the isSelected boolean
            return true;
        });

        // Load sender picture if available
        if (m.senderPicture != null && !m.senderPicture.isEmpty()) {
            String imageID = m.senderPicture.replace("/uploads/", "");  // Extract the image ID
            String fullUrl = BASE_URL + "/uploads/" + imageID;  // Construct the full URL
            Log.d("ImageLoad", "Loading image from URL: " + fullUrl);

// URL to the image
            String imageUrl = "http://10.0.2.2:3000/api/uploads/1751113589014-picture.jpg";

// Start a new thread to avoid blocking the main UI thread
            new Thread(() -> {
                try {
                    // Create a URL object from the image URL
                    URL url = new URL(imageUrl);

                    // Open a connection to the URL
                    HttpURLConnection connection = (HttpURLConnection) url.openConnection();
                    connection.setDoInput(true); // Allow input stream (i.e., downloading the image)
                    connection.connect(); // Connect to the server

                    // Get the input stream from the connection
                    InputStream inputStream = connection.getInputStream();

                    // Decode the InputStream into a Bitmap
                    Bitmap bitmap = BitmapFactory.decodeStream(inputStream);

                    // Update the UI on the main thread (because the UI can only be updated from the main thread)
                    new Handler(Looper.getMainLooper()).post(() -> {
                        // Set the image bitmap to the ImageView
                        holder.avatar.setImageBitmap(bitmap);
                    });
                } catch (Exception e) {
                    e.printStackTrace(); // Print any errors to Logcat

                    // Fallback if there was an error in loading the image
                    new Handler(Looper.getMainLooper()).post(() -> {
                        holder.avatar.setImageResource(R.drawable.default_avatar); // Show default avatar
                    });
                }
            }).start();
        } else {
            holder.avatar.setImageResource(R.drawable.default_avatar); // fallback
        }
    }
    /* ---------- helpers ---------- */

    private void toggleSelection(Mail m, ViewHolder h, boolean clearAll) {
        if (clearAll) {
            selectedIds.clear();
            notifyDataSetChanged();
        } else if (m != null) {
            if (selectedIds.remove(m.id)) ; else selectedIds.add(m.id);
            if (h != null) notifyItemChanged(h.getAdapterPosition());
        }
        if (selListener != null) selListener.onSelectionChanged(selectedIds);
    }

    /* ---------- ViewHolder ---------- */

    static class ViewHolder extends RecyclerView.ViewHolder {
        final ImageView avatar;
        final TextView  subject, preview, sender;
        ViewHolder(View v){
            super(v);
            avatar  = v.findViewById(R.id.mailAvatar);
            subject = v.findViewById(R.id.mailSubject);
            preview = v.findViewById(R.id.mailPreview);
            sender  = v.findViewById(R.id.mailSender);
        }
    }

    /* ---------- callbacks ---------- */

    public interface OnSelectionChangeListener { void onSelectionChanged(Set<String> ids); }
    public interface OnDeleteMailListener      { void onDelete(String mailId); }
}
