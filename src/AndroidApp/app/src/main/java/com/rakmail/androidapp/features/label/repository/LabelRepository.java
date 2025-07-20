// app/src/main/java/com/rakmail/androidapp/features/label/repository/LabelRepository.java
package com.rakmail.androidapp.features.label.repository;

import android.util.Log;

import com.rakmail.androidapp.core.api.ApiClient;
import com.rakmail.androidapp.features.label.data.LabelApi;
import com.rakmail.androidapp.features.label.model.Label;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.concurrent.Executors;

import retrofit2.Response;

public class LabelRepository {

    private static final String TAG = "LabelRepository";
    private static volatile LabelRepository INSTANCE;
    private final LabelApi api;
    private final List<Label> labels = new ArrayList<>();

    private LabelRepository() {
        this.api = ApiClient.get().create(LabelApi.class);
    }

    public static LabelRepository getInstance() {
        if (INSTANCE == null) {
            synchronized (LabelRepository.class) {
                if (INSTANCE == null) {
                    INSTANCE = new LabelRepository();
                }
            }
        }
        return INSTANCE;
    }

    public List<Label> getLabels() {
        return labels;
    }

    public Label getLabelByName(String name) {
        Log.d(TAG, "getLabelByName() called with: name = [" + name + "], labels = [" + labels + "]");
        for (Label label : labels) {
            if (label.getName().equals(name)) {
                return label;
            }
        }
        return null; // Not found
    }

    /** Fetch the latest labels from the API */
    public void refresh() {
        Executors.newSingleThreadExecutor().execute(() -> {
            try {
                Response<List<Label>> res = api.fetchLabels().execute();
                if (res.isSuccessful() && res.body() != null) {
                    labels.clear();
                    labels.addAll(res.body());
                }
            } catch (IOException ex) {
                Log.e(TAG, "fetchLabels failed", ex);
            }
        });
    }

    public Label getLabelById(String id) {
        Log.d(TAG, "getLabelById() called with: id = [" + id + "], labels = [" + labels + "]");
        for (Label label : labels) {
            if (label.getId().equals(id)) {
                return label;
            }
        }
        return null; // Not found
    }

    /** Create a new label */
    public void create(String name, Runnable onError) {
        Executors.newSingleThreadExecutor().execute(() -> {
            try {
                Response<Label> res = api.createLabel(Collections.singletonMap("name", name)).execute();
                if (res.isSuccessful() && res.body() != null) {
                    labels.add(res.body());
                } else {
                    onError.run();
                }
            } catch (IOException ex) {
                Log.e(TAG, "createLabel failed", ex);
                onError.run();
            }
        });
    }

    /** Delete an existing label */
    public void delete(String labelId, Runnable onError) {
        Executors.newSingleThreadExecutor().execute(() -> {
            try {
                Response<Void> res = api.deleteLabel(labelId).execute();
                if (res.isSuccessful()) {
                    // Refresh full list
                    refresh();
                } else {
                    onError.run();
                }
            } catch (IOException ex) {
                Log.e(TAG, "deleteLabel failed", ex);
                onError.run();
            }
        });
    }

    /**
     * Apply or remove a label on a mail.
     * @param labelId       The label to toggle
     * @param mailId        The mail ID (String)
     * @param applyExplicit If true → apply; false → remove; null → toggle
     */
    public void toggle(String labelId, String mailId, Boolean applyExplicit) {
        Executors.newSingleThreadExecutor().execute(() -> {
            try {
                if (applyExplicit == null || applyExplicit) {
                    api.applyLabel(labelId, Collections.singletonMap("mailId", mailId)).execute();
                } else {
                    api.removeLabel(labelId, mailId).execute();
                }
                // After changing, refresh the label list
                refresh();
            } catch (IOException ex) {
                Log.e(TAG, "toggle failed", ex);
            }
        });
    }
}
