package com.rakmail.androidapp.features.inbox.data;

import com.rakmail.androidapp.features.inbox.model.Mail;
import java.util.List;
import retrofit2.Call;
import retrofit2.http.DELETE;
import retrofit2.http.GET;
import retrofit2.http.Path;

public interface MailApi {
    @GET("api/mails")
    Call<List<Mail>> getMails();

    @GET("api/mails/{id}")
    Call<Mail> getMailById(@Path("id") String id);

    @DELETE("/api/mails/{id}")
    Call<Void> deleteMail(@Path("id") String id);

}
