import { useEffect, useState } from "react";
import { useTheme } from "../../context/ThemeContext";
import useLabels from "../../hooks/useLabels.js";
import useMailHandlers from "../../hooks/useMailHandlers.js";
import useMails from "../../hooks/useMails.js";
import useUIs from "../../hooks/useUIs.js";
import ComposeFields from "./ComposeFields";
import ComposeFooter from "./ComposeFooter";
import ComposeHeader from "./ComposeHeader";

export default function ComposeMail({ draftMail = null, handleCloseCompose }) {
    const { darkTheme } = useTheme();
    const { toggleShowCompose } = useUIs();
    const { handleDelete } = useMailHandlers();
    const { fetchMails } = useMails();
    const { fetchLabels } = useLabels();

    const [recipientEmail, setRecipientEmail] = useState("");
    const [subject, setSubject] = useState("");
    const [body, setBody] = useState("");
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (draftMail) {
            setRecipientEmail(draftMail.recipient || "");
            setSubject(draftMail.subject || "");
            setBody(draftMail.body || "");
        }
    }, [draftMail]);

    const handleCloseClick = () => {
        const dirty = recipientEmail || subject || body;
        if (dirty) {
            handleSubmit(true);
        } else {
            finalizeClose();
        }
    };

    const finalizeClose = () => {
        if (draftMail && handleCloseCompose) {
            handleCloseCompose();
        } else {
            toggleShowCompose();
        }
    };

    const handleSubmit = async (isDraft = false) => {
        if (!isDraft && !recipientEmail) {
            setError("Recipient is required.");
            return;
        }

        const payload = {
            recipient: recipientEmail,
            subject,
            body,
            draft: isDraft,
        };

        setLoading(true);
        setError(null);
        try {
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
            finalizeClose();
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
                <ComposeHeader
                    draftMail={draftMail}
                    handleCloseClick={handleCloseClick}
                />
                {error && <div className="alert alert-danger m-3">{error}</div>}
                <ComposeFields
                    recipientEmail={recipientEmail}
                    setRecipientEmail={setRecipientEmail}
                    subject={subject}
                    setSubject={setSubject}
                    body={body}
                    setBody={setBody}
                    draftMail={draftMail}
                />
                <ComposeFooter
                    onSend={() => handleSubmit(false)}
                    draftMail={draftMail}
                    handleDeleteClick={() => {
                        handleDelete(draftMail.id);
                        finalizeClose();
                    }}
                    loading={loading}
                />
            </div>
        </div>
    );
}
