// src/components/LabelManager.jsx
import React, { useState } from "react";
import { useTheme } from "../context/ThemeContext";
import { useNavigate } from "react-router-dom";

export default function LabelManager({ labels, onLabelsChange, onClose }) {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [newLabel, setNewLabel] = useState("");
  const [error, setError] = useState("");

  // Helper to reload labels from server
  const reloadLabels = async () => {
    try {
      const res = await fetch("/api/labels", { credentials: "include" });
      if (res.status === 401) {
        navigate("/signin");
        return;
      }
      if (!res.ok) throw new Error(`Reload failed: ${res.status}`);
      const data = await res.json();
      onLabelsChange(data);
    } catch (err) {
      console.error(err);
      setError("Could not reload labels");
    }
  };

  const createLabel = async () => {
    const name = newLabel.trim();
    if (!name) return;

    try {
      const res = await fetch("/api/labels", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });
      if (res.status === 401) {
        navigate("/signin");
        return;
      }
      if (!res.ok) throw new Error(`Create failed: ${res.status}`);

      // reload authoritative list
      await reloadLabels();
      setNewLabel("");
    } catch (err) {
      console.error(err);
      setError("Could not create label");
    }
  };

  const deleteLabel = async (id) => {
    try {
      const res = await fetch(`/api/labels/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (res.status === 401) {
        navigate("/signin");
        return;
      }
      if (!res.ok) throw new Error(`Delete failed: ${res.status}`);

      // reload authoritative list
      await reloadLabels();
    } catch (err) {
      console.error(err);
      setError("Could not delete label");
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        backgroundColor: "rgba(0,0,0,0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1050,
      }}
    >
      <div
        className="p-4 rounded shadow"
        style={{ width: 400, backgroundColor: theme.bg, color: theme.text }}
      >
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="m-0">Labels</h5>
          <button className="btn-close" onClick={onClose}></button>
        </div>

        {error && <div className="alert alert-danger py-1 mb-3">{error}</div>}

        {/* Add new label */}
        <div className="input-group mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="New label name"
            value={newLabel}
            onChange={(e) => setNewLabel(e.target.value)}
          />
          <button className="btn btn-primary" onClick={createLabel}>
            Add
          </button>
        </div>

        {/* List existing labels */}
        <ul className="list-group mb-3">
          {labels.map(({ id, name }) => (
            <li
              key={id}
              className="list-group-item d-flex justify-content-between align-items-center"
            >
              {name}
              <button
                className="btn btn-sm btn-outline-danger"
                onClick={() => deleteLabel(id)}
              >
                ×
              </button>
            </li>
          ))}
        </ul>

        <button className="btn btn-secondary w-100" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
}
