package com.rakmail.androidapp.features.user.model;

public class User {
    private final String id;
    private final String fullname;
    private final String email;
    private final String picture;

    public User(String id, String fullName, String email, String profilePictureUrl) {
        this.id = id;
        this.fullname = fullName;
        this.email = email;
        this.picture = profilePictureUrl;
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

    public String getPicture() {
        return picture;
    }
}
