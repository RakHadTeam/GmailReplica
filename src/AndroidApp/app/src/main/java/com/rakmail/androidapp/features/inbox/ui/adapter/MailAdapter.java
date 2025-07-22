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
import com.rakmail.androidapp.features.inbox.ui.ComposeMailActivity;
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
    public ViewHolder onCreateViewHolder(
        @NonNull ViewGroup parent,
        int viewType
    ) {
        View view = LayoutInflater.from(parent.getContext())
            .inflate(R.layout.item_mail_row, parent, false);
        return new ViewHolder(view);
    }

    @Override
    public int getItemCount() {
        return items.size();
    }

    @Override
    public void onBindViewHolder(
        @NonNull ViewHolder holder,
        int position
    ) {
        Mail mail = items.get(position);

        // Subject
        holder.subject.setText(
            mail.getSubject() != null
                ? mail.getSubject()
                : "(no subject)"
        );

        // Sender name
        holder.sender.setText(
            mail.getSenderName() != null
                ? mail.getSenderName()
                : "(no sender)"
        );

        // Date formatting
        String rawDate = mail.getCreatedAt();
        String formattedDate = "";
        if (rawDate != null && !rawDate.isEmpty()) {
            try {
                SimpleDateFormat isoFormat =
                    new SimpleDateFormat(
                        "yyyy-MM-dd'T'HH:mm:ss",
                        Locale.getDefault()
                    );
                Date date = isoFormat.parse(rawDate);
                if (date != null) {
                    formattedDate = new SimpleDateFormat(
                        "MMM dd, yyyy HH:mm",
                        Locale.getDefault()
                    ).format(date);
                }
            } catch (Exception ignored) { }
        }
        holder.date.setText(formattedDate);

        // Preview (first 80 chars)
        String body = mail.getBody() != null ? mail.getBody() : "";
        if (body.length() > 80) {
            holder.preview.setText(body.substring(0, 80) + "…");
        } else {
            holder.preview.setText(body);
        }

        // Selection highlight
        if (isSelected(mail.getId())) {
            holder.itemView.setBackgroundColor(
                ContextCompat.getColor(
                    holder.itemView.getContext(),
                    R.color.selected_item_color
                )
            );
            holder.itemView.setElevation(8f);
        } else {
            holder.itemView.setBackgroundColor(Color.TRANSPARENT);
            holder.itemView.setElevation(0f);
        }

        // Click handling: drafts → Compose, others → Detail
        holder.itemView.setOnClickListener(v -> {
            Context ctx = v.getContext();
            if (selectedIds.isEmpty()) {
                if (mail.isDraft()) {
                    Intent intent = new Intent(
                        ctx,
                        ComposeMailActivity.class
                    );
                    intent.putExtra(
                        ComposeMailActivity.EXTRA_DRAFT_ID,
                        mail.getId()
                    );
                    intent.putExtra(
                        ComposeMailActivity.EXTRA_DRAFT_RECIPIENT,
                        mail.getRecipientEmail()
                    );
                    intent.putExtra(
                        ComposeMailActivity.EXTRA_DRAFT_SUBJECT,
                        mail.getSubject()
                    );
                    intent.putExtra(
                        ComposeMailActivity.EXTRA_DRAFT_BODY,
                        mail.getBody()
                    );
                    ctx.startActivity(intent);
                } else {
                    Intent intent = new Intent(
                        ctx,
                        MailDetailActivity.class
                    );
                    intent.putExtra(
                        MailDetailActivity.EXTRA_MAIL,
                        mail
                    );
                    ctx.startActivity(intent);
                }
            } else {
                toggleSelection(mail, holder);
            }
        });

        // Long‑press to multi‑select
        holder.itemView.setOnLongClickListener(v -> {
            toggleSelection(mail, holder);
            return true;
        });

        // Load avatar asynchronously (from BaseMailAdapter)
        loadSenderImage(mail.getSenderPicture(), holder.avatar);
    }

    static class ViewHolder extends RecyclerView.ViewHolder {
        final ImageView avatar;
        final TextView subject, preview, sender, date;

        ViewHolder(View view) {
            super(view);
            avatar  = view.findViewById(R.id.mailAvatar);
            subject = view.findViewById(R.id.mailSubject);
            preview = view.findViewById(R.id.mailPreview);
            sender  = view.findViewById(R.id.mailSender);
            date    = view.findViewById(R.id.mailDate);
        }
    }
}
