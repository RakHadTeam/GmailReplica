// app/src/main/java/com/rakmail/androidapp/features/label/viewmodel/LabelViewModel.java
package com.rakmail.androidapp.features.label.viewmodel;

import androidx.lifecycle.LiveData;
import androidx.lifecycle.MediatorLiveData;
import androidx.lifecycle.MutableLiveData;
import androidx.lifecycle.ViewModel;

import com.rakmail.androidapp.features.label.model.Label;
import com.rakmail.androidapp.features.label.repository.LabelRepository;

import java.util.ArrayList;
import java.util.List;

public class LabelViewModel extends ViewModel {

    private final LabelRepository repo = LabelRepository.getInstance();
    private final MediatorLiveData<List<Label>> visibleLabels = new MediatorLiveData<>();
    private final MutableLiveData<String> searchTerm = new MutableLiveData<>("");

    private final MutableLiveData<List<Label>> labels = new MutableLiveData<>(new ArrayList<>());

    public LabelViewModel() {
        // Initial load
        fetchLabels();
        // Whenever the full list or the search term changes, re‑compute visibleLabels
        visibleLabels.addSource(labels, labels -> combine(labels, searchTerm.getValue()));
        visibleLabels.addSource(searchTerm, term -> combine(labels.getValue(), term));
    }

    public void fetchLabels() {
        // Fetch labels from the repository asynchronously
        new Thread(() -> {
            repo.refresh();
            // Wait for the API call to complete (simple polling)
            try {
                Thread.sleep(500);
            } catch (InterruptedException ignored) {
            }
            labels.postValue(repo.getLabels());
        }).start();
    }

    /** The filtered list to observe in the UI */
    public LiveData<List<Label>> visibleLabels() {
        return visibleLabels;
    }

    /** Update the current search term (re‑filters) */
    public void setSearchTerm(String term) {
        searchTerm.setValue(term != null ? term : "");
    }

    /** Create a new label */
    public void create(String name, Runnable onError) {
        repo.create(name, onError);
    }

    /** Delete an existing label */
    public void delete(String labelId, Runnable onError) {
        repo.delete(labelId, onError);
    }

    /** Toggle (apply/remove) a label on a single mail */
    public void toggle(String labelId, String mailId, Boolean applyExplicit) {
        repo.toggle(labelId, mailId, applyExplicit);
    }

    /**
     * Expose all labels for sharing with other ViewModels
     */
    public LiveData<List<Label>> getLabels() {
        return labels;
    }

    public Label getLabelById(String id) {
        for (Label label : labels.getValue()) {
            if (label.getId().equals(id)) {
                return label; // Found
            }
        }
        return null; // Not found
    }

    public Label getLabelByName(String name) {
        for (Label label : labels.getValue()) {
            if (label.getName().equalsIgnoreCase(name)) {
                return label; // Found
            }
        }
        return null; // Not found
    }

    // Helper to combine raw labels + search term into a filtered list
    private void combine(List<Label> labels, String term) {
        if (labels == null) {
            visibleLabels.setValue(new ArrayList<>());
            return;
        }

        // System labels to exclude
        List<String> systemLabels = List.of("Inbox", "Sent", "Starred", "Drafts", "Spam", "Bin");

        List<Label> filtered = new ArrayList<>();
        String lower = term != null ? term.toLowerCase() : "";
        for (Label l : labels) {
            if (systemLabels.contains(l.getName())) continue; // Exclude system labels
            if (lower.isEmpty() || l.getName().toLowerCase().contains(lower)) {
                filtered.add(l);
            }
        }
        visibleLabels.setValue(filtered);
    }
}
