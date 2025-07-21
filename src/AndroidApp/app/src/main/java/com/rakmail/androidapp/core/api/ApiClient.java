package com.rakmail.androidapp.core.api;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.rakmail.androidapp.core.auth.AuthInterceptor;
import com.rakmail.androidapp.core.prefs.AuthPreferences;

import java.util.concurrent.TimeUnit;

import okhttp3.CookieJar;
import okhttp3.JavaNetCookieJar;
import okhttp3.OkHttpClient;
import retrofit2.Retrofit;
import retrofit2.converter.gson.GsonConverterFactory;

public class ApiClient {

    private static final String BASE_URL = "http://10.0.2.2:80/";
    private static ApiClient instance;
    private final Retrofit retrofit;

    private ApiClient() {

        CookieJar cookieJar = new JavaNetCookieJar(new java.net.CookieManager());

        OkHttpClient ok = new OkHttpClient.Builder()
            .cookieJar(cookieJar)
            .addInterceptor(new AuthInterceptor(AuthPreferences.getInstance()))
            .connectTimeout(5, TimeUnit.SECONDS)
            .readTimeout(5, TimeUnit.SECONDS)
            .writeTimeout(5, TimeUnit.SECONDS)
            .build();

        Gson gson = new GsonBuilder().setLenient().create();

        retrofit = new Retrofit.Builder()
            .baseUrl(BASE_URL)
            .client(ok)
            .addConverterFactory(GsonConverterFactory.create(gson))
            .build();
    }

    public static synchronized ApiClient getInstance() {
        if (instance == null) instance = new ApiClient();
        return instance;
    }

    public <T> T create(Class<T> svc) { return retrofit.create(svc); }
}
