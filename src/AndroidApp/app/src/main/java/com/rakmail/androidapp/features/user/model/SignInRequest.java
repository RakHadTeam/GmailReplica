package com.rakmail.androidapp.features.user.model;

public class SignInRequest {
    public final String email;
    public final String password;

    public SignInRequest(String email, String password) {
        this.email = email;
        this.password = password;
    }
}
