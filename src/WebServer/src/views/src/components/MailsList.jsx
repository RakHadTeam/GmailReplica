// src/components/MailList.jsx
import { useEffect, useState } from "react";
import { useTheme } from "../context/ThemeContext";
import useLabels from "../hooks/useLabels.js";
import useMailHandlers from "../hooks/useMailHandlers.js";
import useMails from "../hooks/useMails.js";
import useStarHandlers from "../hooks/useStarHandlers.js";
import useUIs from "../hooks/useUIs.js";
import ComposeMail from "./ComposeMail.jsx";
import MailDetail from "./MailDetail.jsx";

export default function MailList() {
    const {
        setShowLabelPopup,
        setContextMenu,
        openMailId,
        showCompose,
        toggleShowCompose,
    } = useUIs();
    const { starredIds, activeLabel } = useLabels();
    const { handleSelect, handleOpenMail, handleCloseDetail } =
        useMailHandlers();
    const { handleToggleStar } = useStarHandlers();
    const { mails, filteredMails, selectedMails, setSelectedMails } =
        useMails();

    const [openMail, setOpenMail] = useState(null);

    const { darkTheme } = useTheme();

    const handleRightClick = (e, mailId) => {
        e.preventDefault();
        setContextMenu({ x: e.pageX, y: e.pageY, mailId });
        if (!selectedMails.includes(mailId)) {
            setSelectedMails([]);
            handleSelect(mailId);
        }
        setShowLabelPopup(false);
    };

    useEffect(() => {
        if (openMailId != null) {
            const mail = mails.find((m) => m.id === openMailId);
            setOpenMail(mail);
        } else setOpenMail(null);
    }, [openMailId]);

    if (openMail && !openMail.draft) {
        return <MailDetail handleCloseDetail={handleCloseDetail} />;
    }

    return (
        <div className="w-100 position-relative mt-2">
            {openMail && openMail.draft && (
                <ComposeMail
                    draftMail={openMail}
                    handleCloseCompose={handleCloseDetail}
                />
            )}

            <div
                className={`table w-100 ${
                    darkTheme ? "bg-dark text-white" : "bg-white text-dark"
                }`}
            >
                {filteredMails.map((mail) => {
                    const isSelected = selectedMails.includes(mail.id);
                    return (
                        <div
                            key={mail.id}
                            className={`d-flex rounded-1 align-items-center border-top py-2 px-3 hover-bg ${
                                isSelected ? "bg-primary bg-opacity-10" : ""
                            } ${darkTheme ? "bg-dark text-white" : ""}`}
                            style={{ cursor: "pointer" }}
                            onContextMenu={(e) => handleRightClick(e, mail.id)}
                            onClick={() => handleOpenMail(mail.id)}
                        >
                            <span
                                className="material-symbols-rounded me-2"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleSelect(mail.id);
                                }}
                                style={{ fontSize: "20px", cursor: "pointer" }}
                            >
                                {selectedMails.includes(mail.id)
                                    ? "check_box"
                                    : "check_box_outline_blank"}
                            </span>
                            {activeLabel === "Bin" ? (
                                <span
                                    className="material-symbols-rounded me-3"
                                    style={{
                                        color: darkTheme ? "white" : "black",
                                        fontSize: "20px",
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
                                        fontSize: "20px",
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
                                    style={{
                                        fontSize: "0.9rem",
                                        width: "200px",
                                    }}
                                >
                                    Draft
                                </span>
                            ) : (
                                <div
                                    className={`text-truncate me-2`}
                                    style={{
                                        width: "200px",
                                        flexShrink: 0,
                                        backgroundColor: "transparent",
                                    }}
                                >
                                    {mail.recipientName}
                                </div>
                            )}
                            <div
                                className="d-flex align-items-center overflow-hidden"
                                style={{
                                    minWidth: 0,
                                    flexGrow: 1,
                                    backgroundColor: "transparent",
                                }}
                            >
                                <div
                                    className={`small text-truncate`}
                                    style={{
                                        minWidth: "0",
                                        color: darkTheme ? "white" : "black",
                                        backgroundColor: "transparent",
                                    }}
                                >
                                    <strong className="me-1">
                                        {mail.subject}
                                    </strong>
                                    <span style={{ opacity: 0.7 }}>
                                        – {mail.body.slice(0, 80)}…
                                    </span>
                                </div>
                            </div>
                            <div className="text-nowrap small ms-auto">
                                {new Date(mail.createdAt).toLocaleString(
                                    "en-IL",
                                    {
                                        month: "short",
                                        day: "numeric",
                                        year: "numeric",
                                        hour: "numeric",
                                        minute: "2-digit",
                                    }
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
