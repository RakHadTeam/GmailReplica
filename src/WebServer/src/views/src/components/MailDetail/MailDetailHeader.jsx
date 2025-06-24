import { useMailApp } from "../../context/MailAppContext.js";
import { useTheme } from "../../context/ThemeContext";

export default function MailDetailHeader({ mail }) {
    const { darkTheme } = useTheme();
    const {
        labelState: { labels },
    } = useMailApp();

    return (
        <div
            className={`card-header d-flex justify-content-between align-items-center`}
            style={{
                marginLeft: "4.5rem",
            }}
        >
            <div className="d-flex flex-wrap align-items-center gap-2">
                <h2 className="mb-0">{mail.subject ?? "(no subject)"}</h2>
                {labels?.map((label) => {
                    if (["Bin", "Starred", "Sent"].includes(label.id))
                        return null;
                    if (label.mails.includes(mail.id)) {
                        return (
                            <span
                                key={label.id}
                                className={`badge rounded-pill ms-1 ${
                                    darkTheme ? "text-white" : "text-dark"
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
                    return null;
                })}
            </div>
        </div>
    );
}
