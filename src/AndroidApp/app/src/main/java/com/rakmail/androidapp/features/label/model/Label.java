// app/src/main/java/com/rakmail/androidapp/features/label/model/Label.java
package com.rakmail.androidapp.features.label.model;

import java.util.List;

public class Label {
    private String id;
    private String name;
    private List<String> mails;

    public Label() { }

    public Label(String id, String name, List<String> mails) {
        this.id = id;
        this.name = name;
        this.mails = mails;
    }

    public String getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public List<String> getMailIds() {
        return mails;
    }

    public void setId(String id) {
        this.id = id;
    }

    public void setName(String name) {
        this.name = name;
    }

}
