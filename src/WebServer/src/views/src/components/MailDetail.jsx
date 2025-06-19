import { useTheme } from "../context/ThemeContext";

export default function MailDetail({ openMail, handleCloseDetail }) {
    const { darkTheme } = useTheme();
    if (!openMail) return null;
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
                <div className="d-flex align-items-center gap-3">
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
                        <div className="fw-semibold">
                            From: {openMail.recipientEmail}
                        </div>
                    </div>
                </div>
                <hr className={`${darkTheme ? "border-secondary" : ""}`} />
                <p>{openMail.body}</p>
            </div>
        </div>
    );
}
