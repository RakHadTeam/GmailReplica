package com.rakmail.androidapp.features.user.model;

public class SigninRequest {
    private final String email;
    private final String password;

    public SigninRequest(String email, String password) {
        this.email = email;
        this.password = password;
    }

    public String getEmail() {
        return email;
    }

    public String getPassword() {
        return password;
    }
}
