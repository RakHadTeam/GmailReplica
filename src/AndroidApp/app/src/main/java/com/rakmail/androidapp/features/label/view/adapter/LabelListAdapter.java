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

public class LabelListAdapter
    extends RecyclerView.Adapter<LabelListAdapter.ViewHolder> {

    private final List<Label> items = new ArrayList<>();
    private final BiConsumer<String, Boolean> onToggle;
    private final Consumer<String> onDelete;

    // ← keep track of which label IDs are currently checked
    private final Set<String> checkedLabels = new HashSet<>();

    public LabelListAdapter(BiConsumer<String, Boolean> onToggle,
                            Consumer<String> onDelete) {
        this.onToggle = onToggle;
        this.onDelete = onDelete;
    }

    /** Replace the list of labels in the UI */
    public void submitList(List<Label> list) {
        items.clear();
        items.addAll(list);
        notifyDataSetChanged();
    }

    /** You can call this from your Fragment to pre‑check some labels if needed */
    public void setCheckedLabels(Set<String> initial) {
        checkedLabels.clear();
        if (initial != null) checkedLabels.addAll(initial);
        notifyDataSetChanged();
    }

    @NonNull @Override
    public ViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        View v = LayoutInflater.from(parent.getContext())
            .inflate(R.layout.item_label, parent, false);
        return new ViewHolder(v);
    }

    @Override public int getItemCount() {
        return items.size();
    }

    @Override
    public void onBindViewHolder(@NonNull ViewHolder holder, int pos) {
        Label l = items.get(pos);
        holder.labelName.setText(l.getName());

        // 1) Remove old listener
        holder.checkboxLabel.setOnCheckedChangeListener(null);

        // 2) Initialize checked state from our Set
        boolean checked = checkedLabels.contains(l.getId());
        holder.checkboxLabel.setChecked(checked);

        // 3) Re‑attach listener to update Set + fire your onToggle callback
        holder.checkboxLabel.setOnCheckedChangeListener((cb, isChecked) -> {
            if (isChecked) checkedLabels.add(l.getId());
            else          checkedLabels.remove(l.getId());

            // inform fragment/viewmodel to apply/remove on your mails
            onToggle.accept(l.getId(), isChecked);
        });

        // delete button unchanged
        holder.deleteButton.setOnClickListener(v -> onDelete.accept(l.getId()));
    }

    static class ViewHolder extends RecyclerView.ViewHolder {
        final CheckBox    checkboxLabel;
        final TextView    labelName;
        final ImageButton deleteButton;
        ViewHolder(View v) {
            super(v);
            checkboxLabel = v.findViewById(R.id.checkboxLabel);
            labelName     = v.findViewById(R.id.labelName);
            deleteButton  = v.findViewById(R.id.deleteButton);
        }
    }
}
