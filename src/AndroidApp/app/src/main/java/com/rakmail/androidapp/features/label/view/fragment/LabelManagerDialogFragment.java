package com.rakmail.androidapp.features.label.view.fragment;

import android.os.Bundle;
import android.text.Editable;
import android.text.TextWatcher;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.DialogFragment;
import androidx.lifecycle.ViewModelProvider;
import androidx.recyclerview.widget.LinearLayoutManager;

import com.rakmail.androidapp.core.api.ApiClient;
import com.rakmail.androidapp.databinding.DialogLabelManagerBinding;
import com.rakmail.androidapp.features.label.data.LabelApi;
import com.rakmail.androidapp.features.label.model.Label;
import com.rakmail.androidapp.features.label.view.adapter.LabelListAdapter;
import com.rakmail.androidapp.features.label.viewmodel.LabelViewModel;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import retrofit2.Response;

public class LabelManagerDialogFragment extends DialogFragment {
    private static final String ARG_MAIL_IDS = "mail_ids";

    private DialogLabelManagerBinding binding;
    private LabelViewModel labelViewModel;
    private List<String> mailIdList;

    public static LabelManagerDialogFragment newInstance(ArrayList<String> mailIds) {
        LabelManagerDialogFragment fragment = new LabelManagerDialogFragment();
        Bundle args = new Bundle();
        args.putStringArrayList(ARG_MAIL_IDS, mailIds);
        fragment.setArguments(args);
        return fragment;
    }

    @Override
    public void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        mailIdList = getArguments() != null ? getArguments().getStringArrayList(ARG_MAIL_IDS) : new ArrayList<>();
    }

    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {
        binding = DialogLabelManagerBinding.inflate(inflater, container, false);
        requireDialog().setCanceledOnTouchOutside(true);
        return binding.getRoot();
    }

    @Override
    public void onViewCreated(@NonNull View view, @Nullable Bundle savedInstanceState) {
        labelViewModel = new ViewModelProvider(this).get(LabelViewModel.class);
        LabelListAdapter labelListAdapter = new LabelListAdapter(
            (labelId, checked) -> mailIdList.forEach(mailId -> labelViewModel.toggle(labelId, mailId, checked)),
            labelId -> labelViewModel.delete(labelId, () -> showError("Delete failed"))
        );
        binding.labelList.setLayoutManager(new LinearLayoutManager(getContext()));
        binding.labelList.setAdapter(labelListAdapter);
        new Thread(() -> {
            Set<String> initiallyCheckedLabels = new HashSet<>();
            try {
                LabelApi labelApi = ApiClient.getInstance().create(LabelApi.class);
                Response<List<Label>> response = labelApi.getLabels().execute();
                List<Label> allLabels = response.body() != null ? response.body() : Collections.emptyList();
                for (Label label : allLabels) {
                    if (LabelViewModel.isSystemLabel(label.getName())) continue;
                    List<String> labelMailIds = label.getMailIds();
                    if (labelMailIds == null) continue;
                    boolean coversAll = mailIdList.stream().allMatch(labelMailIds::contains);
                    if (coversAll) initiallyCheckedLabels.add(label.getId());
                }
            } catch (IOException e) {
                e.printStackTrace();
            }
            requireActivity().runOnUiThread(() -> labelListAdapter.setCheckedLabels(initiallyCheckedLabels));
        }).start();
        labelViewModel.visibleLabels().observe(getViewLifecycleOwner(), labels -> {
            List<Label> filteredLabels = new ArrayList<>();
            if (labels != null) {
                for (Label label : labels) {
                    Log.d("LabelManager", "Label: " + label.getName() + ", ID: " + label.getId());
                    if (!LabelViewModel.isSystemLabel(label.getName())) filteredLabels.add(label);
                }
            }
            labelListAdapter.submitList(filteredLabels);
        });
        binding.searchInput.addTextChangedListener(new TextWatcher() {
            @Override public void beforeTextChanged(CharSequence s, int st, int c, int a) {}
            @Override public void afterTextChanged(Editable e) {}
            @Override public void onTextChanged(CharSequence s, int st, int bCount, int c) {
                labelViewModel.setSearchTerm(s != null ? s.toString() : "");
            }
        });
        binding.addButton.setOnClickListener(v -> {
            String name = binding.newLabelInput.getText().toString().trim();
            if (!name.isEmpty()) {
                labelViewModel.create(name, () -> showError("Create failed"));
                Log.d("LabelManager", "Creating label: " + name);
                binding.newLabelInput.setText("");
            } else {
                showError("Label name cannot be empty");
            }
        });
    }

    private void showError(String message) {
        if (getActivity() == null) return;
        getActivity().runOnUiThread(() -> {
            binding.error.setText(message);
            binding.error.setVisibility(View.VISIBLE);
        });
    }

    @Override
    public void onStart() {
        super.onStart();
        if (getDialog() != null && getDialog().getWindow() != null) {
            int width = (int)(getResources().getDisplayMetrics().widthPixels * 0.9);
            getDialog().getWindow().setLayout(width, ViewGroup.LayoutParams.WRAP_CONTENT);
        }
    }
}
