import { useTheme } from "../../context/ThemeContext.js";
import { useAuth } from "../../context/AuthContext.js";

export default function MailSenderInfo({ mail }) {
    const { darkTheme } = useTheme();
    const { currentUser } = useAuth();

    return (
        <div className={`d-flex`}>
            <img
                src={mail.senderPicture}
                alt="Profile"
                className="rounded-circle me-4"
                style={{
                    width: 48,
                    height: 48,
                    objectFit: "cover",
                    border: "1.8px solid var(--bs-primary)",
                    backgroundColor: "white",
                }}
            />
            <div
                className={`flex-grow-1  ${
                    darkTheme
                        ? "bg-dark text-white border-bottom border-secondary"
                        : "bg-white text-dark border-bottom"
                }`}
            >
                <div className="fw-bold">
                    {mail.senderName ?? "(no sender)"}
                </div>
                <div className="small mb-3">
                    {"<"}{mail.senderEmail ?? "(no email)"}{">"}
                </div>
                <div className="small">
                    <span className="fw-semibold me-1">To:</span>
                    {mail.recipient === currentUser.id ? "me" : mail.recipientName ?? "(no recipient)"}{" "}
                    &lt;{mail.recipientEmail ?? "(no email)"}&gt;
                </div>
            </div>
        </div>
    );
}
