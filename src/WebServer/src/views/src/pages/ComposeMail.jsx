import React, { useState } from "react";
import { useTheme } from "../context/ThemeContext.jsx";

export default function ComposeMail() {
  const { theme } = useTheme();
  const [showModal, setShowModal] = useState(false);
  const [recipient, setRecipient] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const resetForm = () => {
    setRecipient("");
    setSubject("");
    setBody("");
    setError(null);
  };

  const handleSubmit = async (isDraft = false) => {
    setLoading(true);
    setError(null);

    try {
      const payload = { recipient, subject, body, draft: isDraft };
      const res = await fetch("/api/mails", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || `Failed to ${isDraft ? "save draft" : "send"}`);
      }

      resetForm();
      setShowModal(false);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>  
      <button
        className="btn btn-primary"
        style={{ backgroundColor: theme.primaryBtn, color: theme.btnText }}
        onClick={() => setShowModal(true)}
      >
        ✉️ Compose
      </button>

      {showModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1050,
          }}
        >
          <div
            className="p-4 rounded shadow"
            style={{
              width: "400px",
              backgroundColor: theme.bg,
              color: theme.text,
            }}
          >
            <div className="d-flex justify-content-between align-items-center mb-4">
              <div className="d-flex align-items-center gap-2">
                <span style={{ fontSize: "1.5rem" }}>✉️</span>
                <h5 className="mb-0">New Message</h5>
              </div>
              <button
                className="btn-close"
                onClick={() => setShowModal(false)}
                aria-label="Close"
              />
            </div>

            {error && <div className="alert alert-danger">{error}</div>}

            <div className="mb-3">
              <label htmlFor="to" className="form-label">To</label>
              <input
                id="to"
                type="email"
                className="form-control"
                placeholder="recipient@example.com"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
              />
            </div>

            <div className="mb-3">
              <label htmlFor="subject" className="form-label">Subject</label>
              <input
                id="subject"
                type="text"
                className="form-control"
                placeholder="Subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
              />
            </div>

            <div className="mb-4">
              <label htmlFor="body" className="form-label">Message</label>
              <textarea
                id="body"
                className="form-control"
                rows={6}
                placeholder="Write your message here..."
                value={body}
                onChange={(e) => setBody(e.target.value)}
              />
            </div>

            <div className="d-flex justify-content-between">
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={() => handleSubmit(true)}
                disabled={loading}
              >
                Save Draft
              </button>

              <div className="d-flex gap-2">
                <button
                  type="button"
                  className="btn btn-outline-light"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  style={{ backgroundColor: theme.primaryBtn, color: theme.btnText }}
                  onClick={() => handleSubmit(false)}
                  disabled={loading}
                >
                  {loading ? "Sending..." : "Send"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
