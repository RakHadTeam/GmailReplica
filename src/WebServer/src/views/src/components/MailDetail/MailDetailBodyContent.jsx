export default function MailBodyContent({ mail }) {
    return (
        <div
            className={`pt-3`}
            style={{
                marginLeft: "4.5rem",
            }}
        >
            <div>{mail.body ?? ""}</div>
        </div>
    );
}
