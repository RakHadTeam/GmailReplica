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
import com.rakmail.androidapp.features.mail.model.Mail;
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

    @Override
    public void setMails(List<Mail> mails) {
        items.clear();
        items.addAll(mails);
        List<String> mailIds = new ArrayList<>();
        for (Mail mail : mails) {
            mailIds.add(mail.getId());
        }
        selectedIds.retainAll(mailIds);
        notifyDataSetChanged();
    }

    @NonNull
    @Override
    public ViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        View view = LayoutInflater.from(parent.getContext())
            .inflate(R.layout.item_mail_row, parent, false);
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
                } catch (Exception e) {
                    formattedDate = "";
                }
            }
            holder.date.setText(formattedDate != null ? formattedDate : "");
        }
        if (holder.preview != null) {
            String previewText = "";
            if (mail.getBody() != null && !mail.getBody().isEmpty()) {
                previewText = mail.getBody().length() > 80 ? mail.getBody().substring(0, 80) + "…" : mail.getBody();
            }
            holder.preview.setText(previewText);
        }
        if (isSelected(mail.getId())) {
            holder.itemView.setBackgroundColor(ContextCompat.getColor(holder.itemView.getContext(), R.color.selected_item_color));
            holder.itemView.setElevation(8f);
        } else {
            holder.itemView.setBackgroundColor(Color.TRANSPARENT);
            holder.itemView.setElevation(0f);
        }
        holder.itemView.setOnClickListener(v -> {
            if (selectedIds.isEmpty()) {
                Context context = v.getContext();
                Intent intent = new Intent(context, MailDetailActivity.class);
                intent.putExtra(MailDetailActivity.EXTRA_MAIL, mail);
                context.startActivity(intent);
            } else {
                toggleSelection(mail, holder);
            }
        });
        holder.itemView.setOnLongClickListener(v -> {
            toggleSelection(mail, holder);
            return true;
        });
        loadSenderImage(mail.getSenderPicture(), holder.avatar);
    }

    static class ViewHolder extends RecyclerView.ViewHolder {
        private final ImageView avatar;
        private final TextView subject, preview, sender, date;
        ViewHolder(View view) {
            super(view);
            avatar = view.findViewById(R.id.mailAvatar);
            subject = view.findViewById(R.id.mailSubject);
            preview = view.findViewById(R.id.mailPreview);
            sender = view.findViewById(R.id.mailSender);
            date = view.findViewById(R.id.mailDate);
        }

        public ImageView getAvatar() { return avatar; }
        public TextView getSubject() { return subject; }
        public TextView getPreview() { return preview; }
        public TextView getSender() { return sender; }
        public TextView getDate() { return date; }
    }
}
