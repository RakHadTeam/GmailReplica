export default function MailBodyContent({ mail }) {
    return (
        <div className="border-top ms-3 pt-3">
            <div style={{ whiteSpace: "pre-wrap" }}>{mail.body ?? ""}</div>
        </div>
    );
}
