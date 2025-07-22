package com.rakmail.androidapp.core.auth;

import com.rakmail.androidapp.core.prefs.AuthPreferences;

import java.io.IOException;

import okhttp3.Interceptor;
import okhttp3.Request;
import okhttp3.Response;

public class AuthInterceptor implements Interceptor {

    private final AuthPreferences prefs;

    public AuthInterceptor(AuthPreferences prefs) {
        this.prefs = prefs;
    }

    @Override
    public Response intercept(Chain chain) throws IOException {
        Request original = chain.request();
        Response response;
        try {
            if (original.header("Cookie") == null) {
                String jwt = prefs.getJwt();
                if (jwt != null) {
                    Request authorised = original.newBuilder()
                        .addHeader("Authorization", "Bearer " + jwt)
                        .build();
                    response = chain.proceed(authorised);
                } else {
                    response = chain.proceed(original);
                }
            } else {
                response = chain.proceed(original);
            }
        } catch (IOException e) {
            // Handle network errors (including timeouts)
            AuthPreferences.UnauthorizedListener listener = AuthPreferences.getUnauthorizedListener();
            if (listener != null) {
                listener.onUnauthorized();
            }
            throw e;
        }
        return response;
    }
}
