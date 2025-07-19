package com.rakmail.androidapp.features.inbox.model;

import android.os.Parcel;
import android.os.Parcelable;

import com.google.gson.annotations.SerializedName;

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

    // These are enriched later on the client (not from the API response)
    private String senderName;
    private String senderEmail;
    private String senderPicture;
    private String recipientName;
    private String recipientEmail;
    private String recipientPicture;

    public Mail() {}

    protected Mail(Parcel in) {
        setId(in.readString());
        setSubject(in.readString());
        setBody(in.readString());
        setSenderId(in.readString());
        setRecipientId(in.readString());
        setDraft(in.readByte() != 0);
        setCreatedAt(in.readString());
        setSenderName(in.readString());
        setSenderEmail(in.readString());
        setSenderPicture(in.readString());
        setRecipientName(in.readString());
        setRecipientEmail(in.readString());
        setRecipientPicture(in.readString());
    }

    @Override
    public void writeToParcel(Parcel dest, int flags) {
        dest.writeString(getId());
        dest.writeString(getSubject());
        dest.writeString(getBody());
        dest.writeString(getSenderId());
        dest.writeString(getRecipientId());
        dest.writeByte((byte) (isDraft() ? 1 : 0));
        dest.writeString(getCreatedAt());
        dest.writeString(getSenderName());
        dest.writeString(getSenderEmail());
        dest.writeString(getSenderPicture());
        dest.writeString(getRecipientName());
        dest.writeString(getRecipientEmail());
        dest.writeString(getRecipientPicture());
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

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getSubject() {
        return subject;
    }

    public void setSubject(String subject) {
        this.subject = subject;
    }

    public String getBody() {
        return body;
    }

    public void setBody(String body) {
        this.body = body;
    }

    public String getSenderId() {
        return senderId;
    }

    public void setSenderId(String senderId) {
        this.senderId = senderId;
    }

    public String getRecipientId() {
        return recipientId;
    }

    public void setRecipientId(String recipientId) {
        this.recipientId = recipientId;
    }

    public boolean isDraft() {
        return draft;
    }

    public void setDraft(boolean draft) {
        this.draft = draft;
    }

    public String getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(String createdAt) {
        this.createdAt = createdAt;
    }

    public String getSenderName() {
        return senderName;
    }

    public void setSenderName(String senderName) {
        this.senderName = senderName;
    }

    public String getSenderEmail() {
        return senderEmail;
    }

    public void setSenderEmail(String senderEmail) {
        this.senderEmail = senderEmail;
    }

    public String getSenderPicture() {
        return senderPicture;
    }

    public void setSenderPicture(String senderPicture) {
        this.senderPicture = senderPicture;
    }

    public String getRecipientName() {
        return recipientName;
    }

    public void setRecipientName(String recipientName) {
        this.recipientName = recipientName;
    }

    public String getRecipientEmail() {
        return recipientEmail;
    }

    public void setRecipientEmail(String recipientEmail) {
        this.recipientEmail = recipientEmail;
    }

    public String getRecipientPicture() {
        return recipientPicture;
    }

    public void setRecipientPicture(String recipientPicture) {
        this.recipientPicture = recipientPicture;
    }
}
