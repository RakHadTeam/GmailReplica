package com.rakmail.androidapp.features.user.model;

public class SigninRequest {
    public final String email;
    public final String password;

    public SigninRequest(String email, String password) {
        this.email = email;
        this.password = password;
    }
}
