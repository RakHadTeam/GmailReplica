package com.rakmail.androidapp.util;

public class Resource<T> {
    public enum Status { SUCCESS, ERROR, LOADING }

    public final Status status;
    public final T data;
    public final String message;

    private Resource(Status s, T d, String m) {
        status = s; data = d; message = m;
    }

    public static <T> Resource<T> success(T d)  { return new Resource<>(Status.SUCCESS, d, null); }
    public static <T> Resource<T> error(String m) { return new Resource<>(Status.ERROR, null, m); }
    public static <T> Resource<T> loading()    { return new Resource<>(Status.LOADING, null, null); }
}
