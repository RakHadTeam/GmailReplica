import { useTheme } from "../../context/ThemeContext";

export default function SearchResultItem({ mail, onClick }) {
  const { darkTheme } = useTheme();
  const date = new Date(mail.createdAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });

  return (
    <div
      className="d-flex align-items-start px-3 py-2 hover-bg"
      style={{ cursor: "pointer" }}
      onClick={onClick}
    >
      <span
        className="material-symbols-rounded me-2"
        style={{ fontSize: 20 }}
      >
        mail
      </span>
      <div className="flex-grow-1 overflow-hidden">
        <div className="fw-bold text-truncate">
          {mail.subject || "(no subject)"}
        </div>
        <div className="text-muted small text-truncate">
          {mail.recipientName || "(no recipient)"}
        </div>
        <div className="text-muted text-truncate">
          – {mail.body.slice(0, 60)}…
        </div>
      </div>
      <div
        className="small text-muted ms-2"
        style={{ whiteSpace: "nowrap" }}
      >
        {date}
      </div>
    </div>
  );
}
