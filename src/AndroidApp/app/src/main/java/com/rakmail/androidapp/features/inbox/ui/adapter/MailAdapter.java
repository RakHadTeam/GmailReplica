package com.rakmail.androidapp.features.inbox.ui.adapter;

import android.content.Context;
import android.content.Intent;
import android.graphics.Color;
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

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

public class MailAdapter extends RecyclerView.Adapter<MailAdapter.ViewHolder> {
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
        items.removeIf(m -> selectedIds.contains(m.getId()));
        clearSelection();
    }
    public void markSelected() {
        for (Mail m : items)
            if (selectedIds.contains(m.getId())) m.setSubject("★ " + m.getSubject());
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
        boolean isSelected = selectedIds.contains(m.getId());

        holder.getSubject().setText(m.getSubject() != null ? m.getSubject() : "(no subject)");
        holder.getPreview().setText(
            m.getBody() != null && m.getBody().length() > 80
                ? m.getBody().substring(0, 80) + "…"
                : (m.getBody() != null ? m.getBody() : "")
        );
        holder.getSender().setText(m.getSenderName() != null ? m.getSenderName() : "(no sender)");

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
            if (!selectedIds.remove(m.getId())) selectedIds.add(m.getId());
            notifyItemChanged(h.getAdapterPosition());
        }
        if (selListener != null) selListener.onSelectionChanged(selectedIds);
    }

    /** Expose selected mail IDs **/
    public Set<String> getSelectedMailIds() {
        return new HashSet<>(selectedIds);
    }

    // Getters for listeners (optional, if needed externally)
    public OnSelectionChangeListener getOnSelectionChangeListener() {
        return selListener;
    }

    public interface OnSelectionChangeListener { void onSelectionChanged(Set<String> ids); }
    public interface OnDeleteMailListener      { void onDelete(String mailId); }

    public OnDeleteMailListener getOnDeleteMailListener() {
        return delListener;
    }

    static class ViewHolder extends RecyclerView.ViewHolder {
        private final ImageView avatar;
        private final TextView subject, preview, sender;
        ViewHolder(View v) {
            super(v);
            avatar  = v.findViewById(R.id.mailAvatar);
            subject = v.findViewById(R.id.mailSubject);
            preview = v.findViewById(R.id.mailPreview);
            sender  = v.findViewById(R.id.mailSender);
        }

        public ImageView getAvatar() {
            return avatar;
        }

        public TextView getSubject() {
            return subject;
        }

        public TextView getPreview() {
            return preview;
        }

        public TextView getSender() {
            return sender;
        }
    }
}
