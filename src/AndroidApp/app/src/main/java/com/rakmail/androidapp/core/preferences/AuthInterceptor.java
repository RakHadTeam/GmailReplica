package com.rakmail.androidapp.core.preferences;

import java.io.IOException;
import okhttp3.Interceptor;
import okhttp3.Request;
import okhttp3.Response;

public class AuthInterceptor implements Interceptor {

    private final AuthPreferences prefs;
    public AuthInterceptor(AuthPreferences prefs) { this.prefs = prefs; }

    @Override
    public Response intercept(Chain chain) throws IOException {
        Request original = chain.request();

        if (original.header("Cookie") == null) {
            String jwt = prefs.getJwt();
            if (jwt != null) {
                Request authorised = original.newBuilder()
                    .addHeader("Authorization", "Bearer " + jwt)
                    .build();
                return chain.proceed(authorised);
            }
        }
        return chain.proceed(original);
    }
}
