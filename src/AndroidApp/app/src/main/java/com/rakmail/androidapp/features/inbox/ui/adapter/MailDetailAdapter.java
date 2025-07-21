package com.rakmail.androidapp.features.inbox.ui.adapter;

import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import com.rakmail.androidapp.R;
import com.rakmail.androidapp.features.mail.model.Mail;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Locale;

public class MailDetailAdapter extends BaseMailAdapter<MailDetailAdapter.ViewHolder> {
    public void setMail(Mail mail) {
        items.clear();
        selectedIds.clear();
        if (mail != null) {
            items.add(mail);
            selectedIds.add(mail.getId());
        }
        notifyDataSetChanged();
    }

    @NonNull
    @Override
    public ViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        View view = LayoutInflater.from(parent.getContext())
            .inflate(R.layout.item_mail_detail, parent, false);
        return new ViewHolder(view);
    }

    @Override
    public int getItemCount() {
        return items.size();
    }

    @Override
    public void onBindViewHolder(@NonNull ViewHolder holder, int position) {
        Mail mail = items.get(position);
        if (holder.subject != null)
            holder.subject.setText(mail.getSubject() != null ? mail.getSubject() : "(no subject)");
        if (holder.sender != null)
            holder.sender.setText(mail.getSenderName() != null ? mail.getSenderName() : "(no sender)");
        if (holder.senderEmail != null)
            holder.senderEmail.setText(mail.getSenderEmail() != null ? "<" + mail.getSenderEmail() + ">" : "");
        if (holder.date != null) {
            String rawDate = mail.getCreatedAt();
            String formattedDate = rawDate;
            if (rawDate != null && !rawDate.isEmpty()) {
                try {
                    SimpleDateFormat isoFormat = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss", Locale.getDefault());
                    Date date = isoFormat.parse(rawDate);
                    if (date != null) {
                        formattedDate = new SimpleDateFormat("MMM dd, yyyy HH:mm", Locale.getDefault()).format(date);
                    }
                } catch (Exception ignored) {}
            }
            holder.date.setText(formattedDate != null ? formattedDate : "");
        }
        if (holder.body != null) {
            holder.body.setText(mail.getBody() != null ? mail.getBody() : "");
        }
        loadSenderImage(mail.getSenderPicture(), holder.avatar);
    }

    static class ViewHolder extends RecyclerView.ViewHolder {
        ImageView avatar;
        TextView subject, sender, senderEmail, date, body;

        ViewHolder(View view) {
            super(view);
            avatar = view.findViewById(R.id.mailAvatar);
            subject = view.findViewById(R.id.mailSubject);
            sender = view.findViewById(R.id.mailSender);
            senderEmail = view.findViewById(R.id.mailSenderEmail);
            date = view.findViewById(R.id.mailDate);
            body = view.findViewById(R.id.mailBody);
        }
    }
}
