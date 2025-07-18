// app/src/main/java/com/rakmail/androidapp/features/label/data/LabelApi.java
package com.rakmail.androidapp.features.label.data;

import com.rakmail.androidapp.features.label.model.Label;
import java.util.List;
import java.util.Map;
import retrofit2.Call;
import retrofit2.http.*;

public interface LabelApi {
    @GET("/api/labels")
    Call<List<Label>> fetchLabels();

    @POST("/api/labels")
    Call<Label> createLabel(@Body Map<String, String> body);

    @DELETE("/api/labels/{id}")
    Call<Void> deleteLabel(@Path("id") String labelId);

    @POST("/api/labels/{labelId}")
    Call<Void> applyLabel(
        @Path("labelId") String labelId,
        @Body Map<String, String> body
    );

    @DELETE("/api/labels/{labelId}/{mailId}")
    Call<Void> removeLabel(
        @Path("labelId") String labelId,
        @Path("mailId") String mailId
    );
}
