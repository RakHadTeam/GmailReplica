import React, { useContext } from "react";
import { useTheme } from "../context/ThemeContext";
import useLabels from "../hooks/useLabels.js";

export default function MailFilter({ activeLabel, setActiveLabel }) {
    const { darkTheme } = useTheme()
    const { labels } = useLabels();
    return (
        <div className="mb-3">
            <label className="form-label me-2">Filter:</label>
            <select
                className={`form-select form-select-sm w-auto d-inline-block ${darkTheme ? "bg-dark text-white border-secondary" : ""}`}
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
    );
}
