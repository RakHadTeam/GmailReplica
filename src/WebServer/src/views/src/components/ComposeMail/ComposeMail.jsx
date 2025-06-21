import { useEffect, useState } from "react";
import { useTheme } from "../../context/ThemeContext";
import { useMailActions } from "../../hooks/useMailActions.js";
import ComposeFields from "./ComposeFields";
import ComposeFooter from "./ComposeFooter";
import ComposeHeader from "./ComposeHeader";

export default function ComposeMail({ draftMail = null, handleCloseCompose }) {
    const { deleteMail, sendOrSaveMail } = useMailActions();
    const { darkTheme } = useTheme();
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
            handleCloseCompose();
        }
    };

    const handleSubmit = async (isDraft = false) => {
        setLoading(true);
        setError(null);

        await sendOrSaveMail({
            draftMail,
            recipient: recipientEmail,
            subject,
            body,
            isDraft,
            onSuccess: handleCloseCompose,
            onError: setError,
        });

        setLoading(false);
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
                        deleteMail(draftMail.id);
                        handleCloseCompose();
                    }}
                    loading={loading}
                />
            </div>
        </div>
    );
}
