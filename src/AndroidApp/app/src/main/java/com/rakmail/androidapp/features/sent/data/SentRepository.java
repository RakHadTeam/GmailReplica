package com.rakmail.androidapp.features.sent.data;

import com.rakmail.androidapp.core.api.ApiClient;
import com.rakmail.androidapp.core.api.MailApi;
import com.rakmail.androidapp.features.inbox.model.Mail;
import java.io.IOException;
import java.util.List;
import retrofit2.Response;

public class SentRepository {
    private final MailApi api = ApiClient.get().create(MailApi.class);

    public List<Mail> getSentMails() throws IOException {
        Response<List<Mail>> res = api.getSentMails().execute();
        if (res.isSuccessful() && res.body()!=null) return res.body();
        throw new IOException("getSentMails failed: " + res.code());
    }
}
