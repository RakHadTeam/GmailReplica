// app/src/main/java/com/rakmail/androidapp/features/inbox/ui/adapter/MailAdapter.java
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

public class MailAdapter extends RecyclerView.Adapter<MailAdapter.ViewHolder> {
    private static final String BASE_URL = "http://10.0.2.2:3000";
    private final List<Mail> items = new ArrayList<>();
    private final Set<String> selectedIds = new HashSet<>();
    private OnSelectionChangeListener selListener;
    private OnDeleteMailListener     delListener;

    public void setMails(List<Mail> mails) {
        items.clear();
        items.addAll(mails);
        selectedIds.clear();
        notifyDataSetChanged();
        if (selListener != null) selListener.onSelectionChanged(selectedIds);
    }
    public void setOnSelectionChangeListener(OnSelectionChangeListener l) { selListener = l; }
    public void setOnDeleteMailListener(OnDeleteMailListener l)           { delListener = l; }

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

    @NonNull @Override
    public ViewHolder onCreateViewHolder(@NonNull ViewGroup p, int t) {
        View v = LayoutInflater.from(p.getContext())
            .inflate(R.layout.item_mail, p, false);
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
                toggleSelection(m, holder, isSelected);
            }
        });
        holder.itemView.setOnLongClickListener(v -> {
            toggleSelection(m, holder, isSelected);
            return true;
        });

        // (avatar‐loading code omitted for brevity)
    }

    private void toggleSelection(Mail m, ViewHolder h, boolean clearAll) {
        if (clearAll) {
            selectedIds.clear();
            notifyDataSetChanged();
        } else if (m != null) {
            if (!selectedIds.remove(m.id)) selectedIds.add(m.id);
            notifyItemChanged(h.getAdapterPosition());
        }
        if (selListener != null) selListener.onSelectionChanged(selectedIds);
    }

    /** Expose selected mail IDs **/
    public Set<String> getSelectedMailIds() {
        return new HashSet<>(selectedIds);
    }

    static class ViewHolder extends RecyclerView.ViewHolder {
        final ImageView avatar;
        final TextView  subject, preview, sender;
        ViewHolder(View v) {
            super(v);
            avatar  = v.findViewById(R.id.mailAvatar);
            subject = v.findViewById(R.id.mailSubject);
            preview = v.findViewById(R.id.mailPreview);
            sender  = v.findViewById(R.id.mailSender);
        }
    }

    public interface OnSelectionChangeListener { void onSelectionChanged(Set<String> ids); }
    public interface OnDeleteMailListener      { void onDelete(String mailId); }
}
