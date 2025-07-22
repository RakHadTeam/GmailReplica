package com.rakmail.androidapp.features.inbox.model;

/**
 * Represents the JSON body for POST /api/mails and PATCH /api/mails/{id}.
 */
public class MailPayload {
    private String recipient;
    private String subject;
    private String body;
    private boolean draft;

    public MailPayload(String recipient,
                       String subject,
                       String body,
                       boolean draft) {
        this.recipient = recipient;
        this.subject   = subject;
        this.body      = body;
        this.draft     = draft;
    }

    // Getters & setters

    public String getRecipient() {
        return recipient;
    }

    public void setRecipient(String recipient) {
        this.recipient = recipient;
    }

    public String getSubject() {
        return subject;
    }

    public void setSubject(String subject) {
        this.subject = subject;
    }

    public String getBody() {
        return body;
    }

    public void setBody(String body) {
        this.body = body;
    }

    public boolean isDraft() {
        return draft;
    }

    public void setDraft(boolean draft) {
        this.draft = draft;
    }
}
