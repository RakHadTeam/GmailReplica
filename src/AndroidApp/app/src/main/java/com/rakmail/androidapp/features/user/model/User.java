package com.rakmail.androidapp.features.user.model;

public class User {
    public String picture;
    private String fullname;
    private String email;
    private String profilePictureUrl;

    public User(String fullname, String email, String profilePictureUrl) {
        this.fullname = fullname;
        this.email = email;
        this.profilePictureUrl = profilePictureUrl;
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
}