package com.rakmail.androidapp.features.inbox.ui.adapter;

import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import com.rakmail.androidapp.R;
import com.rakmail.androidapp.features.inbox.model.Mail;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Locale;

public class MailDetailAdapter extends BaseMailAdapter<MailDetailAdapter.ViewHolder> {
    public void setMail(Mail mail) {
        items.clear();
        if (mail != null) items.add(mail);
        notifyDataSetChanged();
    }

    @NonNull
    @Override
    public ViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        View v = LayoutInflater.from(parent.getContext())
            .inflate(R.layout.item_mail_detail, parent, false);
        return new ViewHolder(v);
    }

    @Override
    public int getItemCount() {
        return items.size();
    }

    @Override
    public void onBindViewHolder(@NonNull ViewHolder holder, int position) {
        Mail m = items.get(position);
        if (holder.subject != null)
            holder.subject.setText(m.getSubject() != null ? m.getSubject() : "(no subject)");
        if (holder.sender != null)
            holder.sender.setText(m.getSenderName() != null ? m.getSenderName() : "(no sender)");
        if (holder.date != null) {
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
            holder.date.setText(formattedDate != null ? formattedDate : "");
        }
        if (holder.preview != null) {
            holder.preview.setText(
                m.getBody() != null && m.getBody().length() > 80
                    ? m.getBody().substring(0, 80) + "…"
                    : (m.getBody() != null ? m.getBody() : "")
            );
        }
        if (holder.body != null) {
            holder.body.setText(m.getBody() != null ? m.getBody() : "");
        }
        loadSenderImage(m.getSenderPicture(), holder.avatar);
    }

    static class ViewHolder extends RecyclerView.ViewHolder {
        ImageView avatar;
        TextView subject, sender, date, preview, body;

        ViewHolder(View v) {
            super(v);
            avatar = v.findViewById(R.id.mailAvatar);
            subject = v.findViewById(R.id.mailSubject);
            sender = v.findViewById(R.id.mailSender);
            date = v.findViewById(R.id.mailDate);
            preview = v.findViewById(R.id.mailPreview);
            body = v.findViewById(R.id.mailBody);
        }
    }
}
