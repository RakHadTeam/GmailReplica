package com.rakmail.androidapp.features.label.view.adapter;

import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.CheckBox;
import android.widget.ImageButton;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import com.rakmail.androidapp.R;
import com.rakmail.androidapp.features.label.model.Label;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.function.BiConsumer;
import java.util.function.Consumer;

public class LabelListAdapter extends RecyclerView.Adapter<LabelListAdapter.ViewHolder> {
    private final List<Label> labels = new ArrayList<>();
    private final BiConsumer<String, Boolean> onToggle;
    private final Consumer<String> onDelete;
    private final BiConsumer<String, String> onEdit;
    private final Set<String> checkedLabelIds = new HashSet<>();

    public LabelListAdapter(BiConsumer<String, Boolean> onToggle, Consumer<String> onDelete, BiConsumer<String, String> onEdit) {
        this.onToggle = onToggle;
        this.onDelete = onDelete;
        this.onEdit = onEdit;
    }

    public void submitList(List<Label> labelList) {
        labels.clear();
        labels.addAll(labelList);
        notifyDataSetChanged();
    }

    public void setCheckedLabels(Set<String> initialChecked) {
        checkedLabelIds.clear();
        if (initialChecked != null) checkedLabelIds.addAll(initialChecked);
        notifyDataSetChanged();
    }

    @NonNull
    @Override
    public ViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        View view = LayoutInflater.from(parent.getContext())
            .inflate(R.layout.item_label, parent, false);
        return new ViewHolder(view);
    }

    @Override
    public int getItemCount() {
        return labels.size();
    }

    @Override
    public void onBindViewHolder(@NonNull ViewHolder holder, int position) {
        Label label = labels.get(position);
        holder.labelName.setText(label.getName());
        holder.checkboxLabel.setOnCheckedChangeListener(null);
        boolean isChecked = checkedLabelIds.contains(label.getId());
        holder.checkboxLabel.setChecked(isChecked);
        holder.checkboxLabel.setOnCheckedChangeListener((cb, checked) -> {
            if (checked) checkedLabelIds.add(label.getId());
            else checkedLabelIds.remove(label.getId());
            onToggle.accept(label.getId(), checked);
        });
        holder.deleteButton.setOnClickListener(v -> onDelete.accept(label.getId()));
        holder.editButton.setOnClickListener(v -> onEdit.accept(label.getId(), label.getName()));
    }

    static class ViewHolder extends RecyclerView.ViewHolder {
        final CheckBox checkboxLabel;
        final TextView labelName;
        final ImageButton editButton;
        final ImageButton deleteButton;
        ViewHolder(View view) {
            super(view);
            checkboxLabel = view.findViewById(R.id.checkboxLabel);
            labelName = view.findViewById(R.id.labelName);
            editButton = view.findViewById(R.id.editButton);
            deleteButton = view.findViewById(R.id.deleteButton);
        }
    }
}
