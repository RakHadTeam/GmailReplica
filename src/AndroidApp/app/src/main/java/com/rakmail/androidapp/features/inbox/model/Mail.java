package com.rakmail.androidapp.features.inbox.model;

import android.os.Parcel;
import android.os.Parcelable;

import com.google.gson.annotations.SerializedName;

public class Mail implements Parcelable {
    @SerializedName("id")
    public String id;

    @SerializedName("subject")
    public String subject;

    @SerializedName("body")
    public String body;

    @SerializedName("sender")
    public String senderId;

    @SerializedName("recipient")
    public String recipientId;

    @SerializedName("draft")
    public boolean draft;

    @SerializedName("createdAt")
    public String createdAt;

    // These are enriched later on the client (not from the API response)
    public String senderName;
    public String senderEmail;
    public String senderPicture;
    public String recipientName;
    public String recipientEmail;
    public String recipientPicture;

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
}
