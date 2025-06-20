import { useEffect } from "react";
import { useTheme } from "../context/ThemeContext";
import useLabels from "../hooks/useLabels.js";
import useMails from "../hooks/useMails.js";
import useUIs from "../hooks/useUIs.js";

export default function MailDetail({ handleCloseDetail }) {
    const { darkTheme } = useTheme();
    const { openMailId } = useUIs();
    const { mails, setSelectedMails } = useMails();
    const { labels } = useLabels();

    useEffect(() => {
        if (openMailId) {
            setSelectedMails([openMailId]);
        } else {
            setSelectedMails([]);
        }
    }, [openMailId]);

    if (!openMailId) return null;
    const openMail = mails.find((mail) => mail.id === openMailId);
    return (
        <div
            className={`card mt-4 border-1 shadow-sm rounded-4 ${
                darkTheme
                    ? "bg-dark text-white border-secondary"
                    : "bg-white text-dark"
            }`}
        >
            <div
                className="card-header d-flex justify-content-between align-items-center"
                style={{ marginLeft: "4.5rem" }}
            >
                <div className="d-flex flex-wrap align-items-center gap-2">
                    <h2 className="mb-0">{openMail.subject}</h2>
                    
                    {labels?.map((label) => {
                        if (label.id === "Bin" || label.id === "Starred")
                            return null;
                        if (label.mails.includes(openMail.id)) {
                            return (
                                <span
                                    key={label.id}
                                    className={`badge rounded-pill ms-1 ${
                                        darkTheme
                                            ? " text-white"
                                            : "text-dark"
                                    }`}
                                    style={{
                                        fontSize: "0.85rem",
                                        backgroundColor: darkTheme
                                            ? "rgba(255, 255, 255, 0.2)"
                                            : "rgba(0, 0, 0, 0.2)",
                                    }}
                                >
                                    {label.name}
                                </span>
                            );
                        }
                    })}
                </div>
            </div>
            <div className="card-body">
                <div className="d-flex">
                    {openMail.recipientPicture && (
                        <img
                            src={`/uploads/${openMail.recipientPicture}`}
                            alt="Profile"
                            className="rounded-circle me-4"
                            style={{
                                width: 48,
                                height: 48,
                                objectFit: "cover",
                                border: "1.8px solid var(--bs-primary)",
                            }}
                        />
                    )}
                    <div className="flex-grow-1">
                        <div className="fw-bold">{openMail.recipientName}</div>
                        <div className="small mb-3">
                            {openMail.recipientEmail}
                        </div>

                        <div className="border-top pt-3">
                            <div style={{ whiteSpace: "pre-wrap" }}>
                                {openMail.body}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
