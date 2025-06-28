import { useMemo, useState } from "react";
import { useAuth } from "../../context/AuthContext.js";
import { useMailApp } from "../../context/MailAppContext.js";
import { useTheme } from "../../context/ThemeContext.js";
import { useLabelActions } from "../../hooks/useLabelActions.js";
import { useStarActions } from "../../hooks/useStarActions.js";

export default function MailListRow({
    mail,
    isSelected,
    onRightClick,
    onClick,
    onSelect,
}) {
    const { darkTheme } = useTheme();
    const {
        uiState: { activeLabel },
    } = useMailApp();
    const { getLabelByName } = useLabelActions();

    const starLabel = getLabelByName("Starred");
    const [starred, setStarred] = useState();
    const { currentUser } = useAuth();

    useMemo(() => {
        if (starLabel) {
            setStarred(starLabel.mails.includes(mail.id));
        }
    }, [starLabel, mail.id]);

    const { toggleStar } = useStarActions();

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

            {activeLabel === "Bin" ? (
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
                        color: starred ? "#fbbc04" : "#ccc",
                        fontSize: 20,
                        cursor: "pointer",
                    }}
                    onClick={(e) => {
                        e.stopPropagation();
                        toggleStar(mail.id);
                        setStarred(!starred);
                    }}
                >
                    {starred ? "★" : "☆"}
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
                    {activeLabel === "Sent" ? (
                        <>
                            To:{" "}
                            {mail.recipient === currentUser.id
                                ? "me"
                                : mail.recipientName ||
                                  mail.recipient ||
                                  "(no recipient)"}
                        </>
                    ) : (
                        <>
                            {mail.sender === currentUser.id
                                ? "me"
                                : mail.senderName ||
                                  mail.sender ||
                                  "(no sender)"}
                        </>
                    )}
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
