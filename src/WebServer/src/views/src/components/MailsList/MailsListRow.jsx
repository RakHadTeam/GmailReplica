import { useTheme } from "../../context/ThemeContext";
import useLabels from "../../hooks/useLabels.js";
import useStarHandlers from "../../hooks/useStarHandlers.js";

export default function MailListRow({
    mail,
    isSelected,
    onRightClick,
    onClick,
    onSelect,
}) {
    const { darkTheme } = useTheme();
    const { starredIds } = useLabels();
    const { handleToggleStar } = useStarHandlers();

    return (
        <div
            key={mail.id}
            data-mail-id={mail.id}
            className={`d-flex rounded-1 align-items-center border-top py-2 px-3 hover-bg ${
                isSelected ? "bg-primary bg-opacity-10" : ""
            } ${darkTheme ? "bg-dark text-white" : ""}`}
            style={{ cursor: "pointer" }}
            onContextMenu={(e) => onRightClick(e, mail.id)}
            onClick={() => onClick(mail.id)}
        >
            <span
                className="material-symbols-rounded me-2"
                onClick={(e) => {
                    e.stopPropagation();
                    onSelect(mail.id);
                }}
                style={{ fontSize: 20, cursor: "pointer" }}
            >
                {isSelected ? "check_box" : "check_box_outline_blank"}
            </span>

            {mail.label === "Bin" ? (
                <span
                    className="material-symbols-rounded me-3"
                    style={{
                        color: darkTheme ? "white" : "black",
                        fontSize: 20,
                    }}
                >
                    delete
                </span>
            ) : (
                <span
                    className="me-3"
                    style={{
                        color: starredIds.includes(mail.id)
                            ? "#fbbc04"
                            : "#ccc",
                        fontSize: 20,
                        cursor: "pointer",
                    }}
                    onClick={(e) => {
                        e.stopPropagation();
                        handleToggleStar(mail.id);
                    }}
                >
                    {starredIds.includes(mail.id) ? "★" : "☆"}
                </span>
            )}

            {mail.draft ? (
                <span
                    className="me-2 text-danger"
                    style={{ fontSize: "0.9rem", width: 200, flexShrink: 0 }}
                >
                    Draft
                </span>
            ) : (
                <div
                    className="text-truncate me-2"
                    style={{ width: 200, flexShrink: 0 }}
                >
                    {mail.recipientName}
                </div>
            )}

            <div
                className="d-flex align-items-center overflow-hidden"
                style={{ minWidth: 0, flexGrow: 1 }}
            >
                <div
                    className="small text-truncate"
                    style={{
                        minWidth: 0,
                        color: darkTheme ? "white" : "black",
                        backgroundColor: "transparent",
                    }}
                >
                    <strong className="me-1">{mail.subject}</strong>
                    <span style={{ opacity: 0.7 }}>
                        {" "}
                        – {mail.body.slice(0, 80)}…
                    </span>
                </div>
            </div>

            <div className="text-nowrap small ms-auto">
                {new Date(mail.createdAt).toLocaleString("en-IL", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                    hour: "numeric",
                    minute: "2-digit",
                })}
            </div>
        </div>
    );
}
