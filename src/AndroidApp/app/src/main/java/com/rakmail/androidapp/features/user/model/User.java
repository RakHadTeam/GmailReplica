package com.rakmail.androidapp.features.user.model;

public class User {
    private final String id;
    private final String fullname;
    private final String email;
    private final String profilePictureUrl;
    public String picture;

    public User(String id, String fullname, String email, String profilePictureUrl) {
        this.id = id;
        this.fullname = fullname;
        this.email = email;
        this.profilePictureUrl = profilePictureUrl;
    }

    public String getId() {
        return id;
    }

    public String getFullname() {
        return fullname;
    }

    public String getEmail() {
        return email;
    }

    public String getProfilePictureUrl() {
        return profilePictureUrl;
    }

    public String getPicture() {
        return picture;
    }
}
