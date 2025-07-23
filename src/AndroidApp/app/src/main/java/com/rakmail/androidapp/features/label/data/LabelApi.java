package com.rakmail.androidapp.features.label.data;

import com.rakmail.androidapp.features.label.model.Label;

import java.util.List;
import java.util.Map;

import retrofit2.Call;
import retrofit2.http.Body;
import retrofit2.http.DELETE;
import retrofit2.http.GET;
import retrofit2.http.PATCH;
import retrofit2.http.POST;
import retrofit2.http.Path;

public interface LabelApi {
    @GET("/api/labels")
    Call<List<Label>> getLabels();

    @POST("/api/labels")
    Call<Label> createLabel(@Body Map<String, String> body);

    @DELETE("/api/labels/{id}")
    Call<Void> deleteLabel(@Path("id") String labelId);

    @PATCH("/api/labels/{id}")
    Call<Label> updateLabel(@Path("id") String labelId, @Body Map<String, String> body);

    @POST("/api/labels/{labelId}")
    Call<Void> applyLabelToMail(
        @Path("labelId") String labelId,
        @Body Map<String, String> body
    );

    @DELETE("/api/labels/{labelId}/{mailId}")
    Call<Void> removeLabelFromMail(
        @Path("labelId") String labelId,
        @Path("mailId") String mailId
    );
}
