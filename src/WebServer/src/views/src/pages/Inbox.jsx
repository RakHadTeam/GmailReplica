import React, { useState, useRef, useEffect } from "react";

const mockMails = [
    { id: 1, sender: "alice@example.com", subject: "Meeting Reminder", preview: "Don’t forget our meeting at 10:00 AM tomorrow...", time: "9:32 AM" },
    { id: 2, sender: "bob@example.com", subject: "New Project", preview: "Attached docs we discussed. Let me know your thoughts.", time: "Yesterday" },
    { id: 3, sender: "team@newsletter.com", subject: "Weekly Roundup", preview: "Here’s what happened this week in tech...", time: "Mon" },
];

export function Inbox() {
    const [contextMenu, setContextMenu] = useState(null); // { x, y, mailId }
    const menuRef = useRef();

    const handleRightClick = (event, mailId) => {
        event.preventDefault();
        setContextMenu({ x: event.pageX, y: event.pageY, mailId });
    };

    const handleAction = (action) => {
        alert(`"${action}" clicked for mail ID ${contextMenu.mailId}`);
        setContextMenu(null);
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
                {mockMails.map((mail) => (
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
                            <div className="fw-bold" style={{ color: "#343a40" }}>{mail.subject}</div>
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
                    <li className="list-group-item list-group-item-action" onClick={() => handleAction("Star")}>⭐ Star</li>
                    <li className="list-group-item list-group-item-action" onClick={() => handleAction("Move to Label")}>🏷️ Move to Label</li>
                </ul>
            )}
        </div>
    );
}
