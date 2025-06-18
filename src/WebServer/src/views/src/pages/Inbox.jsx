import React, { useState, useRef, useEffect } from "react";
import { SettingsPanel } from "./SettingsPanel";
import { useTheme } from "../context/ThemeContext";
import ComposeMail from "./ComposeMail";
import LabelManager from "./LabelManager";

export function Inbox() {
  const [mails, setMails] = useState([]);
  const [labels, setLabels] = useState([]);
  const [starredIds, setStarredIds] = useState([]);
  const [contextMenu, setContextMenu] = useState(null);
  const [showLabelMenu, setShowLabelMenu] = useState(false);
  const [selectedMails, setSelectedMails] = useState([]);
  const [activeLabel, setActiveLabel] = useState("All");
  const [openMailId, setOpenMailId] = useState(null);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [labelsOpen, setLabelsOpen] = useState(false);
  const menuRef = useRef();
  const { theme } = useTheme();

  // Fetch all mails
  const fetchMails = async () => {
    try {
      const res = await fetch("/api/mails", { credentials: "include" });
      if (!res.ok) throw new Error(`Fetch mails failed: ${res.status}`);
      const data = await res.json();
      const enriched = await Promise.all(
        data.map(async (mail) => {
          const uRes = await fetch(`/api/users/${mail.recipient}`, { credentials: "include" });
          const user = uRes.ok ? await uRes.json() : {};
          return {
            ...mail,
            recipientName: user.fullname || user.name || mail.recipient,
            recipientEmail: user.email || "",
            recipientPicture: user.picture || null,
          };
        })
      );
      setMails(enriched);
    } catch (err) {
      console.error(err);
    }
  };

  // Fetch all labels
  const fetchLabels = async () => {
    try {
      const res = await fetch("/api/labels", { credentials: "include" });
      if (!res.ok) throw new Error(`Fetch labels failed: ${res.status}`);
      setLabels(await res.json());
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchMails();
    fetchLabels();
    const mid = setInterval(fetchMails, 15000);
    return () => clearInterval(mid);
  }, []);

  // Close menus on outside click
  useEffect(() => {
    const onClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setContextMenu(null);
        setShowLabelMenu(false);
      }
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  const toggleSettings = () => setSettingsOpen((v) => !v);
  const toggleLabels = () => setLabelsOpen((v) => !v);

  const handleRightClick = (e, mailId) => {
    e.preventDefault();
    setContextMenu({ x: e.pageX, y: e.pageY, mailId });
    setShowLabelMenu(false);
  };
  const handleOpenMail = (mailId) => setOpenMailId(mailId);
  const handleCloseDetail = () => setOpenMailId(null);

  const handleSelect = (id) =>
    setSelectedMails((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  const handleSelectAll = () => {
    const ids = filteredMails.map((m) => m.id);
    setSelectedMails((prev) =>
      prev.length === ids.length ? [] : ids
    );
  };

const handleToggleStar = async (id) => {
  // close any open context menu
  setContextMenu(null);

  // find the built-in “Starred” label
  const starredLabel = labels.find((l) => l.name === "Starred");
  if (!starredLabel) {
    console.error("Starred label not found");
    return;
  }

  // check if this mail is already starred
  const applied = Array.isArray(starredLabel.mails) && starredLabel.mails.includes(id);

  // build URL + options
  const url = applied
    ? `/api/labels/${starredLabel.id}/${id}`   // remove from label
    : `/api/labels/${starredLabel.id}`;       // add to label
  const opts = applied
    ? { method: "DELETE", credentials: "include" }
    : {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mailId: id }),
      };

  try {
    // call API
    await fetch(url, opts);
    // refresh labels & mails so UI stays in sync
    await fetchLabels();
    await fetchMails();
  } catch (err) {
    console.error(err);
  }
};


  const handleToggleStarBulk = () => {
    selectedMails.forEach(handleToggleStar);
    setContextMenu(null);
  };

  const handleDelete = async (id) => {
    try {
      await fetch(`/api/mails/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
    } catch (err) {
      console.error(err);
    }
    await fetchMails();
    setContextMenu(null);
  };
  const handleDeleteBulk = async () => {
    await Promise.all(
      selectedMails.map((id) =>
        fetch(`/api/mails/${id}`, {
          method: "DELETE",
          credentials: "include",
        }).catch(console.error)
      )
    );
    await fetchMails();
    setSelectedMails([]);
    setContextMenu(null);
  };

  // Toggle label on/off:
  // POST   /api/labels/:labelId    { mailId }
  // DELETE /api/labels/:labelId/:mailId
  const handleLabelToggle = async (labelId) => {
    const targets = selectedMails.length ? selectedMails : [contextMenu.mailId];
    for (let mailId of targets) {
      const label = labels.find((l) => l.id === labelId) || {};
      const applied = Array.isArray(label.mails) && label.mails.includes(mailId);
      const url = applied
        ? `/api/labels/${labelId}/${mailId}`
        : `/api/labels/${labelId}`;
      const opts = applied
        ? { method: "DELETE", credentials: "include" }
        : {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ mailId }),
          };
      await fetch(url, opts).catch(console.error);
    }
    await fetchLabels();
    await fetchMails();
    setShowLabelMenu(false);
    setContextMenu(null);
  };

  // Filter logic
  const filteredMails = mails.filter((mail) => {
    if (activeLabel === "All") return true;
    if (activeLabel === "Starred") return starredIds.includes(mail.id);
    const lbl = labels.find((l) => l.id === activeLabel);
    return Array.isArray(lbl?.mails) && lbl.mails.includes(mail.id);
  });

  const openMail = mails.find((m) => m.id === openMailId);

  return (
    <div
      style={{
        backgroundColor: theme.bg,
        color: theme.text,
        minHeight: "100vh",
        width: "100vw",
      }}
    >
      <div className="container py-4">
        <h2 className="text-center fw-bold" style={{ color: theme.primaryBtn }}>
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

        {/* Toolbar */}
        <div className="mb-3 d-flex align-items-center justify-content-between">
          <div>
            <ComposeMail />
            <button
              onClick={toggleLabels}
              className="btn btn-outline-secondary btn-sm ms-2"
            >
              🏷️ Labels
            </button>
            <button
              onClick={handleSelectAll}
              className="btn btn-outline-primary btn-sm ms-2"
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

        {/* Filter */}
        <div className="mb-3">
          <label className="form-label me-2">Filter:</label>
          <select
            className="form-select form-select-sm w-auto d-inline-block"
            value={activeLabel}
            onChange={(e) => setActiveLabel(e.target.value)}
          >
            <option value="All">All</option>
            {labels.map((l) => (
              <option key={l.id} value={l.id}>
                {l.name}
              </option>
            ))}
          </select>
        </div>

        {/* Mail List */}
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
                borderRadius: 6,
                marginBottom: 10,
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
                      marginLeft: 10,
                      color: starredIds.includes(mail.id) ? "#ffc107" : "#aaa",
                      cursor: "pointer",
                      fontSize: "1.2rem",
                    }}
                  >
                    {starredIds.includes(mail.id) ? "★" : "☆"}
                  </span>
                </div>
                <div className="text-muted small">{mail.recipientName}</div>
                <div style={{ marginTop: 6, color: theme.text }}>
                  {mail.body.slice(0, 100)}…
                </div>
              </div>
              <span
                className="badge rounded-pill"
                style={{ backgroundColor: theme.primaryBtn }}
              >
                {mail.createdAt}
              </span>
            </div>
          ))}
        </div>

        {/* Open Mail */}
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
              <div className="d-flex align-items-center gap-3">
                {openMail.recipientPicture && (
                  <img
                    src={`/uploads/${openMail.recipientPicture}`}
                    alt="Profile"
                    className="rounded-circle"
                    style={{
                      width: 48,
                      height: 48,
                      objectFit: "cover",
                      border: `2px solid ${theme.primaryBtn}`,
                    }}
                  />
                )}
                <p className="text-muted mb-0">
                  From: {openMail.recipientEmail}
                </p>
              </div>
              <hr />
              <p>{openMail.body}</p>
            </div>
          </div>
        )}

        {/* Context Menu */}
        {contextMenu && (
          <ul
            ref={menuRef}
            className="list-group shadow"
            style={{
              position: "absolute",
              top: contextMenu.y,
              left: contextMenu.x,
              zIndex: 1000,
              backgroundColor: theme.highlight,
              border: `1px solid ${theme.primaryBtn}44`,
              borderRadius: 5,
              width: 200,
              listStyle: "none",
              padding: 0,
              margin: 0,
              color: theme.text,
              cursor: "pointer",
            }}
          >
            <li
              className="list-group-item list-group-item-action"
              onClick={() => handleDelete(contextMenu.mailId)}
            >
              🗑️ Delete
            </li>
            <li
              className="list-group-item list-group-item-action"
              onClick={() => handleToggleStar(contextMenu.mailId)}
            >
              ⭐ Star
            </li>
            <li
              className="list-group-item list-group-item-action"
              onMouseEnter={() => setShowLabelMenu(true)}
              onMouseLeave={() => setShowLabelMenu(false)}
              style={{ position: "relative" }}
            >
              🏷️ Add Label
              {showLabelMenu && (
                <ul
                  className="list-group shadow"
                  style={{
                    position: "absolute",
                    top: 0,
                    left: "100%",
                    zIndex: 1100,
                    backgroundColor: theme.highlight,
                    border: `1px solid ${theme.primaryBtn}44`,
                    borderRadius: 5,
                    width: 150,
                    listStyle: "none",
                    padding: 0,
                    margin: 0,
                    color: theme.text,
                  }}
                >
                  {labels.map((l) => {
                    const targets = selectedMails.length
                      ? selectedMails
                      : [contextMenu.mailId];
                    const applied = targets.every((mid) =>
                      Array.isArray(l.mails) && l.mails.includes(mid)
                    );
                    return (
                      <li
                        key={l.id}
                        className="list-group-item list-group-item-action d-flex align-items-center"
                        onClick={() => handleLabelToggle(l.id)}
                      >
                        <span className="me-2">
                          {applied ? "✔️" : ""}
                        </span>
                        {l.name}
                      </li>
                    );
                  })}
                </ul>
              )}
            </li>
          </ul>
        )}

        {/* Modals */}
        {settingsOpen && <SettingsPanel onClose={toggleSettings} />}
        {labelsOpen && (
          <LabelManager
            labels={labels}
            onLabelsChange={setLabels}
            onClose={toggleLabels}
          />
        )}
      </div>
    </div>
  );
}
