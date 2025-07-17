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

    private final LabelRepository repo;
    private final MediatorLiveData<List<Label>> visibleLabels = new MediatorLiveData<>();
    private final MutableLiveData<String> searchTerm = new MutableLiveData<>("");

    public LabelViewModel(LabelRepository repo) {
        this.repo = repo;

        LiveData<List<Label>> allLabels = repo.getLabels();

        // Whenever the full list or the search term changes, re‑compute visibleLabels
        visibleLabels.addSource(allLabels, labels -> combine(labels, searchTerm.getValue()));
        visibleLabels.addSource(searchTerm, term   -> combine(allLabels.getValue(), term));

        // Initial load
        repo.refresh();
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

    // Helper to combine raw labels + search term into a filtered list
    private void combine(List<Label> labels, String term) {
        if (labels == null) {
            visibleLabels.setValue(new ArrayList<>());
            return;
        }

        if (term == null || term.isEmpty()) {
            // No filtering
            visibleLabels.setValue(labels);
            return;
        }

        String lower = term.toLowerCase();
        List<Label> filtered = new ArrayList<>();
        for (Label l : labels) {
            if (l.getName().toLowerCase().contains(lower)) {
                filtered.add(l);
            }
        }
        visibleLabels.setValue(filtered);
    }
}
