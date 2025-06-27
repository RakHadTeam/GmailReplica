package com.rakmail.androidapp.core.network;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.rakmail.androidapp.core.preferences.AuthInterceptor;
import com.rakmail.androidapp.core.preferences.AuthPreferences;

import java.util.concurrent.TimeUnit;

import okhttp3.CookieJar;
import okhttp3.JavaNetCookieJar;
import okhttp3.OkHttpClient;
import retrofit2.Retrofit;
import retrofit2.converter.gson.GsonConverterFactory;

public class ApiClient {

    private static final String BASE_URL = "http://10.0.2.2:8080/";
    private static ApiClient instance;
    private final Retrofit retrofit;

    private ApiClient() {

        CookieJar cookieJar = new JavaNetCookieJar(new java.net.CookieManager());

        OkHttpClient ok = new OkHttpClient.Builder()
            .cookieJar(cookieJar)
            .addInterceptor(new AuthInterceptor(AuthPreferences.getInstance()))
            .connectTimeout(15, TimeUnit.SECONDS)
            .readTimeout(15, TimeUnit.SECONDS)
            .build();

        Gson gson = new GsonBuilder().setLenient().create();

        retrofit = new Retrofit.Builder()
            .baseUrl(BASE_URL)
            .client(ok)
            .addConverterFactory(GsonConverterFactory.create(gson))
            .build();
    }

    public static synchronized ApiClient get() {
        if (instance == null) instance = new ApiClient();
        return instance;
    }

    public <T> T create(Class<T> svc) { return retrofit.create(svc); }
}
