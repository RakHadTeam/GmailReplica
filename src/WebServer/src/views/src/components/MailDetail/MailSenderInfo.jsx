export default function MailSenderInfo({ mail }) {
    return (
        <div className="d-flex">
            {mail.recipientPicture && (
                <img
                    src={`/uploads/${mail.recipientPicture}`}
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
                <div className="fw-bold">
                    {mail.recipientName ?? "(no sender)"}
                </div>
                <div className="small mb-3">
                    {mail.recipientEmail ?? "(no email)"}
                </div>
            </div>
        </div>
    );
}
