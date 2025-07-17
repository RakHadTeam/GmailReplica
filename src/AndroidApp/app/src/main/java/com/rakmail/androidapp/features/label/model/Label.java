// app/src/main/java/com/rakmail/androidapp/features/label/model/Label.java
package com.rakmail.androidapp.features.label.model;

import java.util.List;

public class Label {
    private String id;
    private String name;
    private List<String> mails;    // ← hold mail‑IDs from the API

    public Label() { }            // required by Retrofit/Gson

    public Label(String id, String name) {
        this.id   = id;
        this.name = name;
    }

    public String getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    /** This is the key—Retrofit/Gson will populate this from the JSON `mails` field */
    public List<String> getMails() {
        return mails;
    }

    // Optional setters if you ever need them:
    public void setId(String id) {
        this.id = id;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setMails(List<String> mails) {
        this.mails = mails;
    }
}
