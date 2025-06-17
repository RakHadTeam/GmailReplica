import React from "react";

export function SettingsPanel({ onClose }) {
    return (
        <div className="alert alert-light border d-flex justify-content-between align-items-center">
            <span className="fw-bold">Settings Panel (Coming Soon)</span>
            <button className="btn-close" onClick={onClose}></button>
        </div>
    );
}
