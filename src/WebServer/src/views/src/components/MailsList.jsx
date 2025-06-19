import { useEffect, useState } from "react";
import { useTheme } from "../context/ThemeContext";
import useLabels from "../hooks/useLabels.js";
import useMailHandlers from "../hooks/useMailHandlers.js";
import useMails from "../hooks/useMails.js";
import useStarHandlers from "../hooks/useStarHandlers.js";
import useUIs from "../hooks/useUIs.js";
import MailDetail from "./MailDetail.jsx";

export default function MailList() {
    const { filteredMails, selectedMails, setSelectedMails } = useMails();
    const { setShowLabelPopup, setContextMenu, openMailId } = useUIs();
    const { starredIds, activeLabel } = useLabels();
    const { handleSelect, handleOpenMail, handleCloseDetail } = useMailHandlers();
    const { handleToggleStar } = useStarHandlers();

    const handleRightClick = (e, mailId) => {
        e.preventDefault();
        setContextMenu({ x: e.pageX, y: e.pageY, mailId });

        // If mailId is not already selected, select only it
        if (!selectedMails.includes(mailId)) {
            setSelectedMails([]);
            handleSelect(mailId);
        }

        setShowLabelPopup(false);
    };

    useEffect(() => {
        handleOpenMail(openMailId);
    }, [openMailId]);

    const { darkTheme } = useTheme();



    return openMailId != null ? (
        <MailDetail
            handleCloseDetail={handleCloseDetail}
        />
    ) : (
        <div className="w-100">
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
                            className={`d-flex align-items-center border-bottom py-2 px-3 hover-bg ${
                                isSelected ? "bg-primary bg-opacity-10" : ""
                            } ${darkTheme ? "bg-dark text-white" : ""}`}
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
                            <div className="d-flex align-items-center flex-grow-1 overflow-hidden text-truncate">
                                <div
                                    className={`me-2 text-truncate ${
                                        darkTheme ? "text-white" : ""
                                    }`}
                                    style={{
                                        width: "200px",
                                        background: "none",
                                    }}
                                >
                                    {mail.recipientName}
                                </div>
                                <div
                                    className={`small text-truncate ${
                                        darkTheme ? "text-white" : ""
                                    }`}
                                    style={{ background: "none" }}
                                >
                                    <span>{mail.subject}</span>{" "}
                                    <span style={{ opacity: 0.7 }}>– {mail.body.slice(0, 80)}…</span>
                                </div>
                            </div>
                            <div className="text-nowrap small ms-auto">
                                {new Date(mail.createdAt).toLocaleString(
                                    "en-US",
                                    {
                                        month: "short",
                                        day: "numeric",
                                        year: "numeric",
                                        hour: "numeric",
                                        minute: "2-digit",
                                        hour12: true,
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
