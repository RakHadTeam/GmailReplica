package com.rakmail.androidapp.features.inbox.ui.adapter;

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

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

public class MailAdapter extends RecyclerView.Adapter<MailAdapter.ViewHolder> {
    private final List<Mail> items = new ArrayList<>();
    private final Set<String> selectedIds = new HashSet<>();
    private OnSelectionChangeListener selListener;
    private OnDeleteMailListener delListener;
    private OnMailClickListener mailClickListener;

    /** Set the mails to display */
    public void setMails(List<Mail> mails) {
        items.clear();
        items.addAll(mails);
        selectedIds.clear();
        notifyDataSetChanged();
        if (selListener != null) selListener.onSelectionChanged(selectedIds);
    }

    /** Selection change listener */
    public void setOnSelectionChangeListener(OnSelectionChangeListener l) {
        selListener = l;
    }

    /** Delete mail listener */
    public void setOnDeleteMailListener(OnDeleteMailListener l) {
        delListener = l;
    }

    /** Mail click listener (drafts or normal) */
    public void setOnMailClickListener(OnMailClickListener listener) {
        this.mailClickListener = listener;
    }

    public void clearSelection() {
        toggleSelection(null, null, true);
    }

    public void deleteSelected() {
        if (delListener != null) {
            for (String id : selectedIds) {
                delListener.onDelete(id);
            }
        }
        items.removeIf(m -> selectedIds.contains(m.getId()));
        clearSelection();
    }

    public void markSelected() {
        for (Mail m : items) {
            if (selectedIds.contains(m.getId())) {
                m.setSubject("★ " + m.getSubject());
            }
        }
        clearSelection();
    }

    @NonNull
    @Override
    public ViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        View v = LayoutInflater.from(parent.getContext())
            .inflate(R.layout.item_mail, parent, false);
        return new ViewHolder(v);
    }

    @Override
    public void onBindViewHolder(@NonNull ViewHolder holder, int position) {
        Mail m = items.get(position);
        boolean isSelected = selectedIds.contains(m.getId());

        holder.subject.setText(m.getSubject() != null ? m.getSubject() : "(no subject)");
        holder.preview.setText(
            m.getBody() != null && m.getBody().length() > 80
                ? m.getBody().substring(0, 80) + "…"
                : (m.getBody() != null ? m.getBody() : "")
        );
        holder.sender.setText(m.getSenderName() != null ? m.getSenderName() : "(no sender)");

        holder.itemView.setBackgroundColor(
            isSelected
                ? ContextCompat.getColor(holder.itemView.getContext(), R.color.teal_200)
                : Color.TRANSPARENT
        );

        holder.itemView.setOnClickListener(v -> {
            if (!selectedIds.isEmpty()) {
                toggleSelection(m, holder, isSelected);
            } else if (mailClickListener != null) {
                mailClickListener.onMailClick(m);
            }
        });

        holder.itemView.setOnLongClickListener(v -> {
            toggleSelection(m, holder, isSelected);
            return true;
        });

        // (avatar‑loading code omitted)
    }

    @Override
    public int getItemCount() {
        return items.size();
    }

    private void toggleSelection(Mail m, ViewHolder h, boolean clearAll) {
        if (clearAll) {
            selectedIds.clear();
            notifyDataSetChanged();
        } else if (m != null) {
            if (!selectedIds.remove(m.getId())) {
                selectedIds.add(m.getId());
            }
            notifyItemChanged(h.getAdapterPosition());
        }
        if (selListener != null) selListener.onSelectionChanged(selectedIds);
    }

    /** Expose selected mail IDs */
    public Set<String> getSelectedMailIds() {
        return new HashSet<>(selectedIds);
    }

    /** Listener for when mails are selected/unselected */
    public interface OnSelectionChangeListener {
        void onSelectionChanged(Set<String> ids);
    }

    /** Listener for delete action */
    public interface OnDeleteMailListener {
        void onDelete(String mailId);
    }

    /** Listener for clicking a mail (draft or normal) */
    public interface OnMailClickListener {
        void onMailClick(Mail mail);
    }

    static class ViewHolder extends RecyclerView.ViewHolder {
        final ImageView avatar;
        final TextView subject;
        final TextView preview;
        final TextView sender;

        ViewHolder(View v) {
            super(v);
            avatar  = v.findViewById(R.id.mailAvatar);
            subject = v.findViewById(R.id.mailSubject);
            preview = v.findViewById(R.id.mailPreview);
            sender  = v.findViewById(R.id.mailSender);
        }
    }
}
