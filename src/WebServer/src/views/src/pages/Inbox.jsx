import React, { useState, useRef, useEffect } from "react";

export function Inbox() {
    const [mails, setMails] = useState([
        {
            id: 1,
            sender: "alice@example.com",
            subject: "Meeting Reminder",
            preview: "Don’t forget our meeting at 10:00 AM tomorrow...",
            time: "9:32 AM",
            starred: false,
        },
        {
            id: 2,
            sender: "bob@example.com",
            subject: "New Project",
            preview: "Attached docs we discussed. Let me know your thoughts.",
            time: "Yesterday",
            starred: true,
        },
        {
            id: 3,
            sender: "team@newsletter.com",
            subject: "Weekly Roundup",
            preview: "Here’s what happened this week in tech...",
            time: "Mon",
            starred: false,
        },
    ]);

    const [contextMenu, setContextMenu] = useState(null);
    const menuRef = useRef();

    const handleRightClick = (event, mailId) => {
        event.preventDefault();
        setContextMenu({ x: event.pageX, y: event.pageY, mailId });
    };

    const handleToggleStar = (mailId) => {
        setMails((prev) =>
            prev.map((mail) =>
                mail.id === mailId ? { ...mail, starred: !mail.starred } : mail
            )
        );
        setContextMenu(null);
    };

    const handleAction = (action) => {
        if (action === "Star") {
            handleToggleStar(contextMenu.mailId);
        } else {
            alert(`"${action}" clicked for mail ID ${contextMenu.mailId}`);
            setContextMenu(null);
        }
    };

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setContextMenu(null);
            }
        };
        document.addEventListener("click", handleClickOutside);
        return () => document.removeEventListener("click", handleClickOutside);
    }, []);

    return (
        <div className="container py-4">
            <h2 className="mb-4 text-center text-primary fw-bold">📬 Inbox</h2>

            <div className="list-group shadow">
                {mails.map((mail) => (
                    <div
                        key={mail.id}
                        className="list-group-item list-group-item-action d-flex justify-content-between align-items-start"
                        onContextMenu={(e) => handleRightClick(e, mail.id)}
                        style={{
                            backgroundColor: "#f9f9f9",
                            border: "1px solid #dee2e6",
                            borderRadius: "6px",
                            marginBottom: "10px",
                            padding: "15px 20px",
                            cursor: "context-menu",
                        }}
                    >
                        <div className="ms-2 me-auto">
                            <div className="fw-bold d-flex align-items-center" style={{ color: "#343a40" }}>
                                <span>{mail.subject}</span>
                                <span
                                    onClick={() => handleToggleStar(mail.id)}
                                    style={{
                                        marginLeft: "10px",
                                        color: mail.starred ? "#ffc107" : "#ccc",
                                        cursor: "pointer",
                                        fontSize: "1.2rem",
                                    }}
                                    title={mail.starred ? "Unstar" : "Star"}
                                >
                                    {mail.starred ? "★" : "☆"}
                                </span>
                            </div>
                            <div className="text-muted small">{mail.sender}</div>
                            <div style={{ marginTop: "6px", color: "#555" }}>{mail.preview}</div>
                        </div>
                        <span className="badge bg-secondary rounded-pill">{mail.time}</span>
                    </div>
                ))}
            </div>

            {contextMenu && (
                <ul
                    ref={menuRef}
                    className="list-group shadow"
                    style={{
                        position: "absolute",
                        top: contextMenu.y,
                        left: contextMenu.x,
                        zIndex: 1000,
                        backgroundColor: "#ffffff",
                        border: "1px solid #dee2e6",
                        borderRadius: "5px",
                        width: "200px",
                        listStyleType: "none",
                        padding: "0",
                        margin: "0",
                    }}
                >
                    <li className="list-group-item list-group-item-action" onClick={() => handleAction("Delete")}>🗑️ Delete</li>
                    <li className="list-group-item list-group-item-action" onClick={() => handleAction("Star")}>
                        {mails.find(m => m.id === contextMenu.mailId)?.starred ? "⭐ Unstar" : "⭐ Star"}
                    </li>
                    <li className="list-group-item list-group-item-action" onClick={() => handleAction("Move to Label")}>🏷️ Move to Label</li>
                </ul>
            )}
        </div>
    );
}
