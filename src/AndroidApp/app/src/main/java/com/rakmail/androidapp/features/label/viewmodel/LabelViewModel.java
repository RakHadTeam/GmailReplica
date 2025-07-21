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
        fetchLabels();
        visibleLabels.addSource(labels, l -> combine(l, searchTerm.getValue()));
        visibleLabels.addSource(searchTerm, t -> combine(labels.getValue(), t));
    }

    public void fetchLabels() {
        new Thread(() -> {
            repo.refresh();
            try { Thread.sleep(500); } catch (InterruptedException ignored) {}
            labels.postValue(repo.getLabels());
        }).start();
    }

    public LiveData<List<Label>> visibleLabels() {
        return visibleLabels;
    }

    public void setSearchTerm(String term) {
        searchTerm.setValue(term != null ? term : "");
    }

    public void create(String name, Runnable onError) {
        repo.create(name, onError);
    }

    public void delete(String labelId, Runnable onError) {
        repo.delete(labelId, onError);
    }

    public void toggle(String labelId, String mailId, Boolean applyExplicit) {
        repo.toggle(labelId, mailId, applyExplicit);
    }

    public void toggleLabel(String labelName, String mailId, Boolean applyExplicit) {
        Label l = getLabelByName(labelName);
        if (l != null) toggle(l.getId(), mailId, applyExplicit);
    }

    public LiveData<List<Label>> getLabels() {
        return labels;
    }

    public Label getLabelById(String id) {
        for (Label label : labels.getValue()) if (label.getId().equals(id)) return label;
        return null;
    }

    public Label getLabelByName(String name) {
        for (Label label : labels.getValue()) if (label.getName().equalsIgnoreCase(name)) return label;
        return null;
    }

    private void combine(List<Label> labels, String term) {
        if (labels == null) {
            visibleLabels.setValue(new ArrayList<>());
            return;
        }
        List<String> system = List.of("Inbox", "Sent", "Starred", "Drafts", "Spam", "Bin");
        List<Label> filtered = new ArrayList<>();
        String lower = term != null ? term.toLowerCase() : "";
        for (Label l : labels) {
            if (system.contains(l.getName())) continue;
            if (lower.isEmpty() || l.getName().toLowerCase().contains(lower)) filtered.add(l);
        }
        visibleLabels.setValue(filtered);
    }
}
