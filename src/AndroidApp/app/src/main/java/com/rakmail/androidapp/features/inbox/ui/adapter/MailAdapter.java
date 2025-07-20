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

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Locale;

public class MailAdapter extends BaseMailAdapter<MailAdapter.ViewHolder> {
    private final List<Mail> items = new ArrayList<>();

    public MailAdapter() {
        super();
    }

    public void setMails(List<Mail> mails) {
        items.clear();
        items.addAll(mails);
        clearSelection();
        notifyDataSetChanged();
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

        if (holder.getSubject() != null)
            holder.getSubject().setText(m.getSubject() != null ? m.getSubject() : "(no subject)");
        if (holder.getSender() != null)
            holder.getSender().setText(m.getSenderName() != null ? m.getSenderName() : "(no sender)");
        if (holder.getDate() != null) {
            String rawDate = m.getCreatedAt();
            String formattedDate = rawDate;
            if (rawDate != null && !rawDate.isEmpty()) {
                try {
                    SimpleDateFormat isoFormat = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss", Locale.getDefault());
                    Date date = isoFormat.parse(rawDate);
                    if (date != null) {
                        formattedDate = new SimpleDateFormat("MMM dd, yyyy HH:mm", Locale.getDefault()).format(date);
                    }
                } catch (Exception e) {
                    // fallback: show raw date
                }
            }
            holder.getDate().setText(formattedDate != null ? formattedDate : "");
        }
        if (holder.getPreview() != null) {
            holder.getPreview().setText(
                m.getBody() != null && m.getBody().length() > 80
                    ? m.getBody().substring(0, 80) + "…"
                    : (m.getBody() != null ? m.getBody() : "")
            );
        }
        holder.itemView.setBackgroundColor(isSelected(m.getId())
            ? ContextCompat.getColor(holder.itemView.getContext(), R.color.teal_200)
            : Color.TRANSPARENT);
        holder.itemView.setOnClickListener(v -> {
            if (selectedIds.isEmpty()) {
                Context c = v.getContext();
                Intent i = new Intent(c, MailDetailActivity.class);
                i.putExtra(MailDetailActivity.EXTRA_MAIL, m);
                c.startActivity(i);
            } else {
                toggleSelection(m, holder, isSelected(m.getId()));
            }
        });
        holder.itemView.setOnLongClickListener(v -> {
            toggleSelection(m, holder, isSelected(m.getId()));
            return true;
        });
        loadSenderImage(m.getSenderPicture(), holder.avatar);
    }

    static class ViewHolder extends RecyclerView.ViewHolder {
        private final ImageView avatar;
        private final TextView subject, preview, sender, date;
        ViewHolder(View v) {
            super(v);
            avatar = v.findViewById(R.id.mailAvatar);
            subject = v.findViewById(R.id.mailSubject);
            preview = v.findViewById(R.id.mailPreview);
            sender = v.findViewById(R.id.mailSender);
            date = v.findViewById(R.id.mailDate);
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

        public TextView getDate() {
            return date;
        }
    }
}
