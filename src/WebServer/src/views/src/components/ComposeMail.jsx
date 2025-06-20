// src/components/ComposeMail.jsx
import { useEffect, useState } from "react";
import { useTheme } from "../context/ThemeContext";
import useMailHandlers from "../hooks/useMailHandlers.js";
import useMails from "../hooks/useMails.js";
import useUIs from "../hooks/useUIs.js";
import useLabels from "../hooks/useLabels.js";

export default function ComposeMail({ draftMail = null, handleCloseCompose }) {
    const { darkTheme } = useTheme();
    const { toggleShowCompose } = useUIs();
    const { handleDelete } = useMailHandlers();
    const { fetchMails } = useMails();
    const { fetchLabels } = useLabels();

    const [recipient, setRecipient] = useState("");
    const [subject, setSubject] = useState("");
    const [body, setBody] = useState("");
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    // populate fields when editing a draft
    useEffect(() => {
        if (draftMail) {
            setRecipient(draftMail.recipient || "");
            setSubject(draftMail.subject || "");
            setBody(draftMail.body || "");
        }
    }, [draftMail]);

    const onClose = () => {
        const dirty = recipient || subject || body;
        if (dirty) {
            handleSubmit(true);
        } else {
            finishClose();
        }
    };

    const finishClose = () => {
        if (draftMail && handleCloseCompose) {
            handleCloseCompose();
        } else {
            toggleShowCompose(false);
        }
    };

    const handleSubmit = async (isDraft = false) => {
        setLoading(true);
        setError(null);
        try {
            let payload = { recipient, subject, body, draft: isDraft };
            console.log(draftMail);
            const url = draftMail ? `/api/mails/${draftMail.id}` : "/api/mails";
            const method = draftMail ? "PATCH" : "POST";

            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify(payload),
            });
            if (!res.ok) {
                const err = await res.json().catch(() => ({}));
                throw new Error(err.error || "Save failed");
            }

            fetchMails();
            fetchLabels();

            finishClose();
        } catch (e) {
            setError(e.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            style={{
                position: "fixed",
                bottom: "1rem",
                right: "1rem",
                zIndex: 1050,
                width: "480px",
                maxWidth: "100%",
            }}
        >
            <div
                className={`rounded-4 shadow border m-3 ${
                    darkTheme
                        ? "bg-dark text-white border-secondary"
                        : "bg-white text-dark"
                }`}
            >
                <div className="d-flex justify-content-between align-items-center px-3 py-2 border-bottom">
                    <div className="fw-semibold">
                        {draftMail ? "Edit Draft" : "New Message"}
                    </div>
                    <button className="btn btn-sm btn-icon" onClick={onClose}>
                        <span
                            className={`material-symbols-rounded ${
                                darkTheme ? "text-white" : ""
                            }`}
                        >
                            close
                        </span>
                    </button>
                </div>

                {error && <div className="alert alert-danger m-3">{error}</div>}

                <div className="px-3 pt-2">
                    <div className="mb-2">
                        <label className="form-label mb-1 small">
                            Recipient
                        </label>
                        <input
                            type="email"
                            className={`form-control ${
                                darkTheme
                                    ? "bg-dark text-white border-secondary placeholder-white"
                                    : ""
                            }`}
                            value={draftMail && draftMail.recipientEmail ? draftMail.recipientEmail : recipient}
                            onChange={(e) => setRecipient(e.target.value)}
                        />
                    </div>

                    <div className="mb-2">
                        <label className="form-label mb-1 small">Subject</label>
                        <input
                            type="text"
                            className={`form-control ${
                                darkTheme
                                    ? "bg-dark text-white border-secondary placeholder-white"
                                    : ""
                            }`}
                            value={subject}
                            onChange={(e) => setSubject(e.target.value)}
                        />
                    </div>

                    <div className="mb-2">
                        <label className="form-label mb-1 small">Body</label>
                        <textarea
                            className={`form-control ${
                                darkTheme
                                    ? "bg-dark text-white border-secondary placeholder-white"
                                    : ""
                            }`}
                            rows={8}
                            value={body}
                            onChange={(e) => setBody(e.target.value)}
                        />
                    </div>
                </div>

                <div className="d-flex justify-content-between align-items-center px-3 py-2 border-top">
                    <button
                        type="button"
                        className="btn btn-sm d-flex align-items-center gap-2 px-3 py-1 fw-semibold"
                        style={{
                            backgroundColor: "#0b57d0",
                            color: "white",
                            borderRadius: "20px",
                            fontSize: "14px",
                        }}
                        onClick={() => handleSubmit(false)}
                        disabled={loading}
                    >
                        <span
                            className={`material-symbols-rounded ${
                                darkTheme ? "text-white" : ""
                            }`}
                            style={{ fontSize: 18 }}
                        >
                            send
                        </span>
                        {loading ? "Sending..." : "Send"}
                    </button>
                    {draftMail ? (
                        <button
                            type="button"
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => {
                                handleDelete(draftMail.id);
                                finishClose();
                            }}
                            disabled={loading}
                        >
                            <span className="material-symbols-rounded">
                                delete
                            </span>
                        </button>
                    ) : null}
                </div>
            </div>
        </div>
    );
}
