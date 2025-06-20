import React from "react";

export default function ContextMenuItem({ icon, label, onClick }) {
    return (
        <button
            className="btn btn-light w-100 text-start d-flex align-items-center gap-2"
            onClick={onClick}
        >
            <span className="material-symbols-rounded">{icon}</span>
            {label}
        </button>
    );
}
