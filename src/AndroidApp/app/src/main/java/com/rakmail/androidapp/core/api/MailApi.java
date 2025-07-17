package com.rakmail.androidapp.core.api;

import com.rakmail.androidapp.features.inbox.model.Mail;
import java.util.List;
import retrofit2.Call;
import retrofit2.http.GET;
import retrofit2.http.PATCH;
import retrofit2.http.Path;

public interface MailApi {
    /** fetch all mails */
    @GET("/api/mails")
    Call<List<Mail>> getMails();

    /** toggle star on a mail */
    @PATCH("/api/mails/{id}/star")
    Call<Void> toggleStar(@Path("id") String id);
}
