import { useTheme } from "../../context/ThemeContext.jsx";

export default function ComposeFields({
    recipientEmail,
    setRecipientEmail,
    subject,
    setSubject,
    body,
    setBody,
    draftMail,
}) {
    const { darkTheme } = useTheme();

    return (
        <div className="px-3 pt-2">
            <div className="mb-2">
                <label className="form-label mb-1 small">Recipient</label>
                <input
                    type="email"
                    className={`form-control ${
                        darkTheme
                            ? "bg-dark text-white border-secondary placeholder-white"
                            : ""
                    }`}
                    value={draftMail?.recipientEmail ?? recipientEmail}
                    onChange={(e) => setRecipientEmail(e.target.value)}
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
    );
}
