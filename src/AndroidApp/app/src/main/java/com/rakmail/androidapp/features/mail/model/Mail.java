package com.rakmail.androidapp.features.mail.model;

import android.os.Parcel;
import android.os.Parcelable;
import com.google.gson.annotations.SerializedName;

/**
 * Model representing a Mail item, including sender/recipient info and draft status.
 */
public class Mail implements Parcelable {
    @SerializedName("id")
    private String id;
    @SerializedName("subject")
    private String subject;
    @SerializedName("body")
    private String body;
    @SerializedName("sender")
    private String senderId;
    @SerializedName("recipient")
    private String recipientId;
    @SerializedName("draft")
    private boolean draft;
    @SerializedName("createdAt")
    private String createdAt;

    // Enriched client-side (not from API)
    private String senderName;
    private String senderEmail;
    private String senderPicture;
    private String recipientName;
    private String recipientEmail;
    private String recipientPicture;

    public Mail() {}

    protected Mail(Parcel in) {
        id = in.readString();
        subject = in.readString();
        body = in.readString();
        senderId = in.readString();
        recipientId = in.readString();
        draft = in.readByte() != 0;
        createdAt = in.readString();
        senderName = in.readString();
        senderEmail = in.readString();
        senderPicture = in.readString();
        recipientName = in.readString();
        recipientEmail = in.readString();
        recipientPicture = in.readString();
    }

    @Override
    public void writeToParcel(Parcel dest, int flags) {
        dest.writeString(id);
        dest.writeString(subject);
        dest.writeString(body);
        dest.writeString(senderId);
        dest.writeString(recipientId);
        dest.writeByte((byte) (draft ? 1 : 0));
        dest.writeString(createdAt);
        dest.writeString(senderName);
        dest.writeString(senderEmail);
        dest.writeString(senderPicture);
        dest.writeString(recipientName);
        dest.writeString(recipientEmail);
        dest.writeString(recipientPicture);
    }

    @Override
    public int describeContents() {
        return 0;
    }

    public static final Creator<Mail> CREATOR = new Creator<Mail>() {
        @Override
        public Mail createFromParcel(Parcel in) {
            return new Mail(in);
        }
        @Override
        public Mail[] newArray(int size) {
            return new Mail[size];
        }
    };

    // Getters and setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getSubject() { return subject; }
    public void setSubject(String subject) { this.subject = subject; }
    public String getBody() { return body; }
    public void setBody(String body) { this.body = body; }
    public String getSenderId() { return senderId; }
    public void setSenderId(String senderId) { this.senderId = senderId; }
    public String getRecipientId() { return recipientId; }
    public void setRecipientId(String recipientId) { this.recipientId = recipientId; }
    public boolean isDraft() { return draft; }
    public void setDraft(boolean draft) { this.draft = draft; }
    public String getCreatedAt() { return createdAt; }
    public void setCreatedAt(String createdAt) { this.createdAt = createdAt; }
    public String getSenderName() { return senderName; }
    public void setSenderName(String senderName) { this.senderName = senderName; }
    public String getSenderEmail() { return senderEmail; }
    public void setSenderEmail(String senderEmail) { this.senderEmail = senderEmail; }
    public String getSenderPicture() { return senderPicture; }
    public void setSenderPicture(String senderPicture) { this.senderPicture = senderPicture; }
    public String getRecipientName() { return recipientName; }
    public void setRecipientName(String recipientName) { this.recipientName = recipientName; }
    public String getRecipientEmail() { return recipientEmail; }
    public void setRecipientEmail(String recipientEmail) { this.recipientEmail = recipientEmail; }
    public String getRecipientPicture() { return recipientPicture; }
    public void setRecipientPicture(String recipientPicture) { this.recipientPicture = recipientPicture; }
}
