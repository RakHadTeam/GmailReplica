package com.rakmail.androidapp.features.inbox.ui.manager;

import android.content.Context;
import android.widget.Toast;

import androidx.lifecycle.LifecycleOwner;
import androidx.lifecycle.ViewModelProvider;

import com.rakmail.androidapp.databinding.ActivityMainBinding;
import com.rakmail.androidapp.features.inbox.data.MailRepository;
import com.rakmail.androidapp.features.inbox.viewmodel.InboxViewModel;
import com.rakmail.androidapp.features.inbox.viewmodel.InboxViewModelFactory;
import com.rakmail.androidapp.features.label.repository.LabelRepository;
import com.rakmail.androidapp.features.label.viewmodel.LabelViewModel;
import com.rakmail.androidapp.features.user.data.UserRepository;

public class ViewModelManager {
    private final InboxViewModel inboxViewModel;
    private final LabelViewModel labelViewModel;
    private OnMailsChangedListener mailsChangedListener;

    public ViewModelManager(ActivityMainBinding binding, Context context, LifecycleOwner lifecycleOwner) {
        MailRepository mailRepository = MailRepository.getInstance();
        LabelRepository labelRepository = LabelRepository.getInstance();
        UserRepository userRepository = UserRepository.getInstance();
        InboxViewModelFactory factory = new InboxViewModelFactory(mailRepository, labelRepository, userRepository);
        inboxViewModel = new ViewModelProvider((androidx.fragment.app.FragmentActivity) context, factory).get(InboxViewModel.class);
        labelViewModel = new ViewModelProvider((androidx.fragment.app.FragmentActivity) context).get(LabelViewModel.class);

        inboxViewModel.getVisibleMails().observe(lifecycleOwner, mails -> {
            if (mailsChangedListener != null) {
                mailsChangedListener.onMailsChanged(mails);
            }
            if (binding.swipeRefresh.isRefreshing()) {
                binding.swipeRefresh.setRefreshing(false);
            }
        });
        inboxViewModel.getIsLoading().observe(lifecycleOwner, isLoading -> {
            binding.swipeRefresh.setRefreshing(isLoading != null && isLoading);
        });
        inboxViewModel.getErrorMessage().observe(lifecycleOwner, error -> {
            if (error != null && !error.isEmpty()) {
                Toast.makeText(context, error, Toast.LENGTH_LONG).show();
            }
        });
        labelViewModel.fetchLabels();
        inboxViewModel.fetchMails();
    }

    public void setOnMailsChangedListener(OnMailsChangedListener listener) {
        this.mailsChangedListener = listener;
    }

    public InboxViewModel getInboxViewModel() {
        return inboxViewModel;
    }

    public LabelViewModel getLabelViewModel() {
        return labelViewModel;
    }

    public interface OnMailsChangedListener {
        void onMailsChanged(java.util.List<com.rakmail.androidapp.features.inbox.model.Mail> mails);
    }
}
