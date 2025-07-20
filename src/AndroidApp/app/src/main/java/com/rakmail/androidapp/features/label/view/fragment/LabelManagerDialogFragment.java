// app/src/main/java/com/rakmail/androidapp/features/label/view/fragment/LabelManagerDialogFragment.java
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

    private DialogLabelManagerBinding b;
    private LabelViewModel vm;
    private List<String> mailIds;

    public static LabelManagerDialogFragment newInstance(ArrayList<String> mailIds) {
        LabelManagerDialogFragment frag = new LabelManagerDialogFragment();
        Bundle args = new Bundle();
        args.putStringArrayList(ARG_MAIL_IDS, mailIds);
        frag.setArguments(args);
        return frag;
    }

    @Override
    public void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        mailIds = getArguments() != null
            ? getArguments().getStringArrayList(ARG_MAIL_IDS)
            : new ArrayList<>();
    }

    @Nullable @Override
    public View onCreateView(@NonNull LayoutInflater inflater,
                             @Nullable ViewGroup container,
                             @Nullable Bundle savedInstanceState) {
        b = DialogLabelManagerBinding.inflate(inflater, container, false);
        requireDialog().setCanceledOnTouchOutside(true);
        return b.getRoot();
    }

    @Override
    public void onViewCreated(@NonNull View view, @Nullable Bundle savedInstanceState) {
        // 1) Set up ViewModel
        vm = new ViewModelProvider(this).get(LabelViewModel.class);

        // 2) Create adapter with onToggle + onDelete callbacks
        LabelListAdapter adapter = new LabelListAdapter(
            (labelId, checked) -> {
                // apply/remove for each selected mail
                for (String mailId : mailIds) {
                    vm.toggle(labelId, mailId, checked);
                }
            },
            labelId -> vm.delete(labelId, () -> showError("Delete failed"))
        );

        // 3) Wire up RecyclerView
        b.labelList.setLayoutManager(new LinearLayoutManager(getContext()));
        b.labelList.setAdapter(adapter);

        // 4) Compute “initialChecked” in background via Label API
        new Thread(() -> {
            Set<String> initialChecked = new HashSet<>();
            try {
                LabelApi api = ApiClient.get().create(LabelApi.class);
                Response<List<Label>> resp = api.fetchLabels().execute();
                List<Label> all = resp.body() != null ? resp.body() : Collections.emptyList();

                for (Label lab : all) {
                    String rawName = lab.getName();
                    if (rawName == null) continue;
                    String nm = rawName.toLowerCase();
                    // skip special labels
                    if (nm.equals("starred") ||
                        nm.equals("spam")    ||
                        nm.equals("bin")     ||
                        nm.equals("sent")) {
                        continue;
                    }
                    // only check if this label applies to ALL selected mails
                    List<String> labMails = lab.getMailsIds();
                    if (labMails == null) continue;
                    boolean coversAll = true;
                    for (String mid : mailIds) {
                        if (!labMails.contains(mid)) {
                            coversAll = false;
                            break;
                        }
                    }
                    if (coversAll) {
                        initialChecked.add(lab.getId());
                    }
                }
            } catch (IOException e) {
                e.printStackTrace();
            }
            requireActivity().runOnUiThread(() -> adapter.setCheckedLabels(initialChecked));
        }).start();

        // 5) Observe labels, filter out special ones, and submit to adapter
        vm.visibleLabels().observe(getViewLifecycleOwner(), labels -> {
            Log.d("labelFrag", "labels changed: " + labels);
            List<Label> filtered = new ArrayList<>();
            if (labels != null) {
                for (Label l : labels) {
                    String raw = l.getName();
                    if (raw == null) continue;
                    String lower = raw.toLowerCase();
                    if (lower.equals("starred") ||
                        lower.equals("spam")    ||
                        lower.equals("bin")     ||
                        lower.equals("sent")) {
                        continue;
                    }
                    filtered.add(l);
                }
            }
            adapter.submitList(filtered);
        });

        // 6) Search box drives ViewModel
        b.searchInput.addTextChangedListener(new TextWatcher() {
            @Override public void beforeTextChanged(CharSequence s, int st, int c, int a) { }
            @Override public void afterTextChanged(Editable e) { }
            @Override public void onTextChanged(CharSequence s, int st, int bCount, int c) {
                vm.setSearchTerm(s != null ? s.toString() : "");
            }
        });

        // 7) “Add label” button
        b.addButton.setOnClickListener(v -> {
            String name = b.newLabelInput.getText().toString().trim();
            if (!name.isEmpty()) {
                vm.create(name, () -> showError("Create failed"));
                b.newLabelInput.setText("");
            }
        });
    }

    private void showError(String msg) {
        if (getActivity() == null) return;
        getActivity().runOnUiThread(() -> {
            b.error.setText(msg);
            b.error.setVisibility(View.VISIBLE);
        });
    }

    @Override public void onStart() {
        super.onStart();
        if (getDialog() != null && getDialog().getWindow() != null) {
            int w = (int)(getResources().getDisplayMetrics().widthPixels * 0.9);
            getDialog().getWindow().setLayout(w, ViewGroup.LayoutParams.WRAP_CONTENT);
        }
    }
}
