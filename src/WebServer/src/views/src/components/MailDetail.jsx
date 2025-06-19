import { useTheme } from "../context/ThemeContext";
import useMails from "../hooks/useMails.js";
import useUIs from "../hooks/useUIs.js";

export default function MailDetail({ handleCloseDetail }) {
    const { darkTheme } = useTheme();
    const { openMailId } = useUIs();
    const { mails } = useMails();
    if (!openMailId) return null;
    const openMail = mails.find((mail) => mail.id === openMailId);
    return (
        <div
            className={`card mt-4 border-0 ${
                darkTheme
                    ? "bg-dark text-white border-secondary"
                    : "bg-white text-dark"
            }`}
        >
            <div className="card-header d-flex justify-content-between align-items-center">
                <h5 className="mb-0">{openMail.subject}</h5>
                <button onClick={handleCloseDetail} className="btn-close" />
            </div>
            <div className="card-body">
                <div className="d-flex align-items-center gap-3 mb-3">
                    {openMail.recipientPicture && (
                        <img
                            src={`/uploads/${openMail.recipientPicture}`}
                            alt="Profile"
                            className="rounded-circle"
                            style={{
                                width: 48,
                                height: 48,
                                objectFit: "cover",
                                border: "2px solid var(--bs-primary)",
                            }}
                        />
                    )}
                    <div>
                        <div className="fw-bold">{openMail.recipientName}</div>
                        <div className="text-muted small">{openMail.recipientEmail}</div>
                    </div>
                </div>

                <div className="border-top pt-3" style={{ whiteSpace: "pre-wrap", paddingLeft: "1.5rem" }}>
                    {openMail.body}
                </div>
            </div>
        </div>
    );
}
