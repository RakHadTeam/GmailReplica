import React, { useState, useRef, useEffect } from "react";

export function Inbox() {
    const [mails, setMails] = useState([
        {
            id: 1,
            sender: "alice@example.com",
            subject: "Meeting Reminder",
            preview: "Don’t forget our meeting at 10:00 AM tomorrow...",
            body: "Full content of the meeting reminder email.",
            time: "9:32 AM",
            starred: false,
            deleted: false,
            label: "Work",
        },
        {
            id: 2,
            sender: "bob@example.com",
            subject: "New Project",
            preview: "Attached docs we discussed. Let me know your thoughts.",
            body: "Here's everything you need to know about the new project...",
            time: "Yesterday",
            starred: true,
            deleted: false,
            label: "Personal",
        },
        {
            id: 3,
            sender: "team@newsletter.com",
            subject: "Weekly Roundup",
            preview: "Here’s what happened this week in tech...",
            body: "This week's news covers React updates, Node releases, and more.",
            time: "Mon",
            starred: false,
            deleted: false,
            label: "Updates",
        },
    ]);

    const [contextMenu, setContextMenu] = useState(null);
    const [selectedMails, setSelectedMails] = useState([]);
    const [activeLabel, setActiveLabel] = useState("All");
    const [openMailId, setOpenMailId] = useState(null);
    const menuRef = useRef();

    const handleRightClick = (event, mailId) => {
        event.preventDefault();
        setContextMenu({ x: event.pageX, y: event.pageY, mailId });
    };

    const handleOpenMail = (mailId) => {
        setOpenMailId(mailId);
    };

    const handleCloseDetail = () => {
        setOpenMailId(null);
    };

    const handleToggleStar = (mailId) => {
        setMails((prev) =>
            prev.map((mail) =>
                mail.id === mailId ? { ...mail, starred: !mail.starred } : mail
            )
        );
        setContextMenu(null);
    };

    const handleToggleStarBulk = () => {
        setMails((prev) =>
            prev.map((mail) =>
                selectedMails.includes(mail.id)
                    ? { ...mail, starred: !mail.starred }
                    : mail
            )
        );
        setContextMenu(null);
    };

    const handleDelete = (mailId) => {
        setMails((prev) =>
            prev.map((mail) =>
                mail.id === mailId ? { ...mail, deleted: true } : mail
            )
        );
        setContextMenu(null);
    };

    const handleDeleteBulk = () => {
        setMails((prev) =>
            prev.map((mail) =>
                selectedMails.includes(mail.id)
                    ? { ...mail, deleted: true }
                    : mail
            )
        );
        setContextMenu(null);
        setSelectedMails([]);
    };

    const handleAction = (action) => {
        if (action === "Star") {
            if (selectedMails.includes(contextMenu.mailId)) {
                handleToggleStarBulk();
            } else {
                handleToggleStar(contextMenu.mailId);
            }
        } else if (action === "Delete") {
            if (selectedMails.includes(contextMenu.mailId)) {
                handleDeleteBulk();
            } else {
                handleDelete(contextMenu.mailId);
            }
        } else {
            alert(`"${action}" clicked for mail ID ${contextMenu.mailId}`);
            setContextMenu(null);
        }
    };

    const handleSelect = (mailId) => {
        setSelectedMails((prev) =>
            prev.includes(mailId)
                ? prev.filter((id) => id !== mailId)
                : [...prev, mailId]
        );
    };

    const handleSelectAll = () => {
        const visibleMailIds = filteredMails.map(mail => mail.id);
        setSelectedMails((prev) =>
            prev.length === visibleMailIds.length ? [] : visibleMailIds
        );
    };

    const filteredMails = mails.filter(mail => {
        return !mail.deleted && (activeLabel === "All" || mail.label === activeLabel);
    }).slice(-50);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setContextMenu(null);
            }
        };
        document.addEventListener("click", handleClickOutside);
        return () => document.removeEventListener("click", handleClickOutside);
    }, []);

    const uniqueLabels = ["All", ...new Set(mails.map(mail => mail.label))];

    const openMail = mails.find(m => m.id === openMailId);

    return (
        <div className="container py-4">
            <h2 className="mb-4 text-center text-primary fw-bold">📬 Inbox</h2>

            <div className="mb-3 d-flex align-items-center justify-content-between">
                <div>
                    <button onClick={handleSelectAll} className="btn btn-outline-primary btn-sm">
                        {selectedMails.length === filteredMails.length ? "Deselect All" : "Select All"}
                    </button>
                    <span className="ms-3 text-muted">Selected: {selectedMails.length}</span>
                </div>
                {selectedMails.length > 0 && (
                    <div>
                        <button onClick={handleDeleteBulk} className="btn btn-outline-danger btn-sm me-2">Delete Selected</button>
                        <button onClick={handleToggleStarBulk} className="btn btn-outline-warning btn-sm">Toggle Star</button>
                    </div>
                )}
            </div>

            <div className="mb-3">
                <label className="form-label me-2">Filter by Label:</label>
                <select
                    className="form-select form-select-sm w-auto d-inline-block"
                    value={activeLabel}
                    onChange={(e) => setActiveLabel(e.target.value)}
                >
                    {uniqueLabels.map(label => (
                        <option key={label} value={label}>{label}</option>
                    ))}
                </select>
            </div>

            <div className="list-group shadow">
                {filteredMails.map((mail) => (
                    <div
                        key={mail.id}
                        className="list-group-item list-group-item-action d-flex justify-content-between align-items-start"
                        onContextMenu={(e) => handleRightClick(e, mail.id)}
                        onClick={() => handleOpenMail(mail.id)}
                        style={{
                            backgroundColor: "#f9f9f9",
                            border: "1px solid #dee2e6",
                            borderRadius: "6px",
                            marginBottom: "10px",
                            padding: "15px 20px",
                            cursor: "pointer",
                        }}
                    >
                        <input
                            type="checkbox"
                            className="form-check-input me-3 mt-2"
                            checked={selectedMails.includes(mail.id)}
                            onClick={(e) => e.stopPropagation()}
                            onChange={() => handleSelect(mail.id)}
                        />

                        <div className="ms-2 me-auto">
                            <div className="fw-bold d-flex align-items-center" style={{ color: "#343a40" }}>
                                <span>{mail.subject}</span>
                                <span
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleToggleStar(mail.id);
                                    }}
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

            {openMail && (
                <div className="card mt-4">
                    <div className="card-header d-flex justify-content-between align-items-center">
                        <h5 className="mb-0">{openMail.subject}</h5>
                        <button onClick={handleCloseDetail} className="btn-close" />
                    </div>
                    <div className="card-body">
                        <p className="text-muted">From: {openMail.sender}</p>
                        <p>{openMail.body}</p>
                    </div>
                </div>
            )}

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
                    <li className="list-group-item list-group-item-action" onClick={() => handleAction("Star")}>⭐ {mails.find(m => m.id === contextMenu.mailId)?.starred ? "Unstar" : "Star"}</li>
                    <li className="list-group-item list-group-item-action" onClick={() => handleAction("Move to Label")}>🏷️ Move to Label</li>
                </ul>
            )}
        </div>
    );
}
