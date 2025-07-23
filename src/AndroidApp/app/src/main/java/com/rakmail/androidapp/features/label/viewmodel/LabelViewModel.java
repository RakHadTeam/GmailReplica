package com.rakmail.androidapp.features.label.viewmodel;

import androidx.lifecycle.LiveData;
import androidx.lifecycle.MediatorLiveData;
import androidx.lifecycle.MutableLiveData;
import androidx.lifecycle.ViewModel;

import com.rakmail.androidapp.features.label.data.LabelRepository;
import com.rakmail.androidapp.features.label.model.Label;

import java.util.ArrayList;
import java.util.List;
import java.util.function.Consumer;

public class LabelViewModel extends ViewModel {
    private final LabelRepository repo = LabelRepository.getInstance();
    private final MediatorLiveData<List<Label>> visibleLabels = new MediatorLiveData<>();
    private final MutableLiveData<String> searchTerm = new MutableLiveData<>("");
    private final MutableLiveData<List<Label>> labels = new MutableLiveData<>(new ArrayList<>());
    private final MutableLiveData<Boolean> labelChangedEvent = new MutableLiveData<>(false);

    public static final List<String> SYSTEM_LABELS = List.of("Inbox", "Sent", "Starred", "Drafts", "Spam", "Bin");

    public static boolean isSystemLabel(String labelName) {
        return labelName != null && SYSTEM_LABELS.contains(labelName);
    }

    public LabelViewModel() {
        // Initialize visibleLabels and sources before fetching
        visibleLabels.setValue(new ArrayList<>());
        visibleLabels.addSource(labels, l -> filterLabels(l, searchTerm.getValue()));
        visibleLabels.addSource(searchTerm, term -> filterLabels(labels.getValue(), term));
        // perform initial filtering on default empty list
        filterLabels(labels.getValue(), searchTerm.getValue());
        // fetch labels after sources are set so updates notify observers
        fetchLabels();
    }

    public void fetchLabels() {
        repo.fetchLabels(() -> {
            // run on background thread, so postValue to update LiveData safely
            labels.postValue(repo.getLabels());
            notifyLabelChanged();
        });
    }

    public LiveData<List<Label>> getVisibleLabels() {
        return visibleLabels;
    }

    public void setSearchTerm(String term) {
        searchTerm.setValue(term != null ? term : "");
    }

    public void create(String name, Consumer<String> onError) {
        repo.createLabel(name, () -> {
            fetchLabels();
            notifyLabelChanged();
        }, onError);
    }

    public void delete(String labelId, Consumer<String> onError) {
        repo.deleteLabel(labelId, () -> {
            labels.postValue(repo.getLabels());
            notifyLabelChanged();
        }, onError);
    }

    public void update(String labelId, String newName, Consumer<String> onError) {
        repo.updateLabel(labelId, newName, () -> {
            fetchLabels();
            notifyLabelChanged();
        }, onError);
    }

    public void toggle(String labelId, String mailId, Boolean applyExplicit) {
        repo.toggleLabel(labelId, mailId, applyExplicit, () -> {
            labels.postValue(repo.getLabels());
            notifyLabelChanged();
        });
    }

    public LiveData<List<Label>> getLabels() {
        return labels;
    }

    public Label getLabelById(String id) {
        List<Label> current = labels.getValue();
        if (current != null) {
            for (Label label : current) {
                if (label.getId().equals(id)) {
                    return label;
                }
            }
        }
        return null;
    }

    public Label getLabelByName(String name) {
        List<Label> current = labels.getValue();
        if (current != null) {
            for (Label label : current) {
                if (label.getName().equalsIgnoreCase(name)) {
                    return label;
                }
            }
        }
        return null;
    }

    private void filterLabels(List<Label> labels, String term) {
        if (labels == null) {
            visibleLabels.setValue(new ArrayList<>());
            return;
        }
        List<Label> filtered = new ArrayList<>();
        String lower = term != null ? term.toLowerCase() : "";
        for (Label label : labels) {
            if (isSystemLabel(label.getName())) continue;
            if (lower.isEmpty() || label.getName().toLowerCase().contains(lower)) {
                filtered.add(label);
            }
        }
        visibleLabels.setValue(filtered);
    }

    public void notifyLabelChanged() {
        labelChangedEvent.postValue(true);
    }
    public void resetLabelChangedEvent() {
        labelChangedEvent.postValue(false);
    }
    public LiveData<Boolean> getLabelChangedEvent() {
        return labelChangedEvent;
    }
}
