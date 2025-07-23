package com.rakmail.androidapp.features.label.data;

import android.util.Log;

import com.rakmail.androidapp.core.api.ApiClient;
import com.rakmail.androidapp.features.label.model.Label;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.concurrent.Executors;

import retrofit2.Response;

public class LabelRepository {
    private static final String TAG = "LabelRepository";
    private static volatile LabelRepository instance;
    private final LabelApi api;
    private final List<Label> labels = new ArrayList<>();

    private LabelRepository() {
        this.api = ApiClient.getInstance().create(LabelApi.class);
    }

    public static LabelRepository getInstance() {
        if (instance == null) {
            synchronized (LabelRepository.class) {
                if (instance == null) {
                    instance = new LabelRepository();
                }
            }
        }
        return instance;
    }

    public List<Label> getLabels() {
        return labels;
    }

    public Label getLabelByName(String name) {
        Log.d(TAG, "getLabelByName: " + name);
        for (Label label : labels) {
            if (label.getName().equals(name)) {
                return label;
            }
        }
        return null;
    }

    public void fetchLabels(Callback callback) {
        Executors.newSingleThreadExecutor().execute(() -> {
            try {
                Response<List<Label>> res = api.getLabels().execute();
                if (res.isSuccessful() && res.body() != null) {
                    for (Label label : res.body()) {
                        Log.d(TAG, "Fetched label: " + label.getName() + " with ID: " + label.getId());
                        for (String mailId : label.getMailIds()) {
                            Log.d(TAG, "Label " + label.getName() + " has mail ID: " + mailId);
                        }
                    }

                    labels.clear();

                    labels.addAll(res.body());
                }
                if (callback != null) callback.onComplete();
            } catch (IOException ex) {
                Log.e(TAG, "fetchLabels failed", ex);
                if (callback != null) callback.onComplete();
            }
        });
    }

    public void fetchLabelsSync() {
        try {
            Response<List<Label>> res = api.getLabels().execute();
            if (res.isSuccessful() && res.body() != null) {
                labels.clear();
                labels.addAll(res.body());
            }
        } catch (IOException ex) {
            Log.e(TAG, "fetchLabelsSync failed", ex);
        }
    }

    public interface Callback {
        void onComplete();
    }

    public Label getLabelById(String id) {
        Log.d(TAG, "getLabelById: " + id);
        for (Label label : labels) {
            if (label.getId().equals(id)) {
                return label;
            }
        }
        return null;
    }

    public void createLabel(String name, Runnable onComplete, java.util.function.Consumer<String> onError) {
        Executors.newSingleThreadExecutor().execute(() -> {
            try {
                Response<Label> res = api.createLabel(Collections.singletonMap("name", name)).execute();
                if (res.isSuccessful() && res.body() != null) {
                    labels.add(res.body());
                    if (onComplete != null) onComplete.run();
                } else {
                    String errorMsg = null;
                    try {
                        if (res.errorBody() != null) {
                            String errorString = res.errorBody().string();
                            org.json.JSONObject errorJson = new org.json.JSONObject(errorString);
                            errorMsg = errorJson.optString("error", "Create label failed: " + res.code());
                        }
                    } catch (Exception e) {
                        errorMsg = "Create label failed: " + res.code();
                    }
                    if (onError != null) onError.accept(errorMsg);
                }
            } catch (IOException ex) {
                Log.e(TAG, "createLabel failed", ex);
                if (onError != null) onError.accept(ex.getMessage());
            }
        });
    }

    public void deleteLabel(String labelId, Runnable onComplete, java.util.function.Consumer<String> onError) {
        Executors.newSingleThreadExecutor().execute(() -> {
            try {
                Response<Void> response = api.deleteLabel(labelId).execute();
                if (response.isSuccessful()) {
                    fetchLabelsSync();
                    if (onComplete != null) onComplete.run();
                } else {
                    String errorMsg = null;
                    try {
                        if (response.errorBody() != null) {
                            String errorString = response.errorBody().string();
                            org.json.JSONObject errorJson = new org.json.JSONObject(errorString);
                            errorMsg = errorJson.optString("error", "Delete label failed: " + response.code());
                        }
                    } catch (Exception e) {
                        errorMsg = "Delete label failed: " + response.code();
                    }
                    if (onError != null) onError.accept(errorMsg);
                }
            } catch (IOException ex) {
                Log.e(TAG, "deleteLabel failed", ex);
                if (onError != null) onError.accept(ex.getMessage());
            }
        });
    }

    public void updateLabel(String labelId, String newName, Runnable onComplete, java.util.function.Consumer<String> onError) {
        Executors.newSingleThreadExecutor().execute(() -> {
            try {
                Response<Label> response = api.updateLabel(labelId, Collections.singletonMap("name", newName)).execute();
                if (response.isSuccessful()) {
                    fetchLabelsSync();
                    if (onComplete != null) onComplete.run();
                } else {
                    String errorMsg = null;
                    try {
                        if (response.errorBody() != null) {
                            String errorString = response.errorBody().string();
                            org.json.JSONObject errorJson = new org.json.JSONObject(errorString);
                            errorMsg = errorJson.optString("error", "Update label failed: " + response.code());
                        }
                    } catch (Exception e) {
                        errorMsg = "Update label failed: " + response.code();
                    }
                    if (onError != null) onError.accept(errorMsg);
                }
            } catch (IOException ex) {
                Log.e(TAG, "updateLabel failed", ex);
                if (onError != null) onError.accept(ex.getMessage());
            }
        });
    }

    public void toggleLabel(String labelId, String mailId, Boolean applyExplicit, Runnable onComplete) {
        Executors.newSingleThreadExecutor().execute(() -> {
            try {
                boolean apply = applyExplicit != null ? applyExplicit : !getLabelById(labelId).getMailIds().contains(mailId);
                if (apply) {
                    api.applyLabelToMail(labelId, Collections.singletonMap("mailId", mailId)).execute();
                } else {
                    api.removeLabelFromMail(labelId, mailId).execute();
                }
                fetchLabelsSync();
                if (onComplete != null) onComplete.run();
            } catch (IOException ex) {
                Log.e(TAG, "toggleLabel failed", ex);
            }
        });
    }
}
