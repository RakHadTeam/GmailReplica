package com.rakmail.androidapp.core.util;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.lifecycle.LiveData;
import androidx.lifecycle.MutableLiveData;

public class Resource<T> {
    public enum Status { SUCCESS, ERROR, LOADING }
    @NonNull public final Status status;
    @Nullable public final T data;
    @Nullable public final String message;

    private Resource(Status status, @Nullable T data, @Nullable String msg) {
        this.status = status;
        this.data   = data;
        this.message= msg;
    }

    public static <T> Resource<T> success(@Nullable T d) {
        return new Resource<>(Status.SUCCESS, d, null);
    }
    public static <T> Resource<T> error(@NonNull String msg) {
        return new Resource<>(Status.ERROR, null, msg);
    }
    public static <T> Resource<T> loading() {
        return new Resource<>(Status.LOADING, null, null);
    }
}
