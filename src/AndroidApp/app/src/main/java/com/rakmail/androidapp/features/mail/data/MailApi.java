package com.rakmail.androidapp.features.mail.data;

import com.rakmail.androidapp.features.mail.model.Mail;
import java.util.List;
import retrofit2.Call;
import retrofit2.http.DELETE;
import retrofit2.http.GET;
import retrofit2.http.Path;

/**
 * API interface for mail operations (fetch, get by ID, delete).
 */
public interface MailApi {
    @GET("api/mails")
    Call<List<Mail>> getMails();

    @GET("api/mails/{id}")
    Call<Mail> getMailById(@Path("id") String id);

    @DELETE("/api/mails/{id}")
    Call<Void> deleteMail(@Path("id") String id);
}
