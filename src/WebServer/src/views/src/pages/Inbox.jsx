import React, { useState, useRef, useEffect } from "react";
import { SettingsPanel } from "./SettingsPanel";
import { useTheme } from "../context/ThemeContext";

export function Inbox() {
  const [mails, setMails] = useState([
    {
      id: 1,
      sender: "alice@example.com",
      subject: "Meeting Reminder",
      body: "Full content of the meeting reminder email.",
      createdAt: new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
      labels: ["Work"],
    },
    {
      id: 2,
      sender: "bob@example.com",
      subject: "New Project",
      body: "Here's everything you need to know about the new project...",
      createdAt: new Date(2023, 9, 1).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
      labels: ["Personal"],
    },
    {
      id: 3,
      sender: "team@newsletter.com",
      subject: "Weekly Roundup",
      body: "This week's news covers React updates, Node releases, and more.",
      createdAt: new Date(2023, 9, 2).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
      labels: ["Updates"],
    },
  ]);

  const [contextMenu, setContextMenu] = useState(null);
  const [selectedMails, setSelectedMails] = useState([]);
  const [activeLabel, setActiveLabel] = useState("All");
  const [openMailId, setOpenMailId] = useState(null);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const menuRef = useRef();
  const { theme } = useTheme();
  const toggleSettings = () => setSettingsOpen((prev) => !prev);

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
        mail.id === mailId
          ? {
              ...mail,
              labels: mail.labels.includes("Starred")
                ? mail.labels.filter((label) => label !== "Starred")
                : [...mail.labels, "Starred"],
            }
          : mail
      )
    );
    setContextMenu(null);
  };

  const handleToggleStarBulk = () => {
    for (const mailId of selectedMails) {
      handleToggleStar(mailId);
    }
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
    for (const mailId of selectedMails) {
      handleDelete(mailId);
    }
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
    const visibleMailIds = filteredMails.map((mail) => mail.id);
    setSelectedMails((prev) =>
      prev.length === visibleMailIds.length ? [] : visibleMailIds
    );
  };

  const filteredMails = mails
    .filter((mail) => {
      return (
        !mail.deleted &&
        (activeLabel === "All" || mail.labels.includes(activeLabel))
      );
    })
    .slice(-50);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setContextMenu(null);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const uniqueLabels = [
    ...new Set(
      ["All", "Starred"].concat(
        mails
          .flatMap((mail) => mail.labels)
          .filter((label) => label !== "Bin" && label !== "Sent")
      )
    ),
  ];
  const openMail = mails.find((m) => m.id === openMailId);

  return (
    // outer wrapper now full-viewport:
    <div
      style={{
        backgroundColor: theme.bg,
        color: theme.text,
        minHeight: "100vh",
        width: "100vw",
      }}
    >
      {/* inner container keeps your layout centered */}
      <div className="container py-4">
        <h2
          className="mb-4 text-center fw-bold"
          style={{ color: theme.primaryBtn }}
        >
          📬 Inbox
        </h2>

        <div className="position-absolute top-0 start-0 m-3">
          <button
            className="btn btn-sm"
            style={{
              backgroundColor: theme.primaryBtn,
              color: theme.btnText,
              border: "none",
            }}
            onClick={toggleSettings}
          >
            ⚙️ Settings
          </button>
        </div>

        <div className="mb-3 d-flex align-items-center justify-content-between">
          <div>
            <button
              onClick={handleSelectAll}
              className="btn btn-outline-primary btn-sm"
            >
              {selectedMails.length === filteredMails.length
                ? "Deselect All"
                : "Select All"}
            </button>
            <span className="ms-3 text-muted">
              Selected: {selectedMails.length}
            </span>
          </div>
          {selectedMails.length > 0 && (
            <div>
              <button
                onClick={handleDeleteBulk}
                className="btn btn-outline-danger btn-sm me-2"
              >
                Delete Selected
              </button>
              <button
                onClick={handleToggleStarBulk}
                className="btn btn-outline-warning btn-sm"
              >
                Toggle Star
              </button>
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
            {uniqueLabels.map((label) => (
              <option key={label} value={label}>
                {label}
              </option>
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
                backgroundColor: theme.highlight,
                border: `1px solid ${theme.primaryBtn}33`,
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
                <div className="fw-bold d-flex align-items-center">
                  <span>{mail.subject}</span>
                  <span
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleStar(mail.id);
                    }}
                    style={{
                      marginLeft: "10px",
                      color: mail.labels.includes("Starred")
                        ? "#ffc107"
                        : "#aaa",
                      cursor: "pointer",
                      fontSize: "1.2rem",
                    }}
                    title={
                      mail.labels.includes("Starred") ? "Unstar" : "Star"
                    }
                  >
                    {mail.labels.includes("Starred") ? "★" : "☆"}
                  </span>
                </div>
                <div className="text-muted small">{mail.sender}</div>
                <div style={{ marginTop: "6px", color: theme.text }}>
                  {mail.body.slice(0, 100)}...
                </div>
              </div>
              <span
                className="badge bg-secondary rounded-pill"
                style={{ backgroundColor: theme.primaryBtn }}
              >
                {mail.createdAt}
              </span>
            </div>
          ))}
        </div>

        {openMail && (
          <div
            className="card mt-4"
            style={{ backgroundColor: theme.bg, color: theme.text }}
          >
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
              cursor: "pointer",
              zIndex: 1000,
              backgroundColor: theme.highlight,
              border: `1px solid ${theme.primaryBtn}44`,
              borderRadius: "5px",
              width: "200px",
              listStyleType: "none",
              padding: "0",
              margin: "0",
              color: theme.text,
            }}
          >
            <li
              className="list-group-item list-group-item-action"
              onClick={() => handleAction("Delete")}
            >
              🗑️ Delete
            </li>
            <li
              className="list-group-item list-group-item-action"
              onClick={() => handleAction("Star")}
            >
              ⭐ Star
            </li>
            <li
              className="list-group-item list-group-item-action"
              onClick={() => handleAction("Move to Label")}
            >
              🏷️ Move to Label
            </li>
          </ul>
        )}

        {settingsOpen && <SettingsPanel onClose={toggleSettings} />}
      </div>
    </div>
  );
}
