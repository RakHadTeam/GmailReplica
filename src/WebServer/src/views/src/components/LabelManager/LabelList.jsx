import { useState } from "react";
import { useMailApp } from "../../context/MailAppContext.js";
import { useTheme } from "../../context/ThemeContext.js";
import { useLabelActions } from "../../hooks/useLabelActions.js";

export default function LabelList({ searchTerm, setError }) {
    const {
        labelState: { labels },
    } = useMailApp();

    const { deleteLabel, editLabel } = useLabelActions();
    const { darkTheme } = useTheme();

    const [editingLabel, setEditingLabel] = useState(null);
    const [newLabelName, setNewLabelName] = useState("");

    const handleEditLabel = (labelId) => {
        if (editingLabel !== labelId) {
            editLabel(labelId, newLabelName);
        }
    };

    return (
        <ul className={`list-group ${darkTheme ? "bg-dark" : ""}`}>
            {labels
                .filter(
                    (label) =>
                        !["starred", "bin", "spam", "sent"].includes(
                            label.name.toLowerCase()
                        )
                )
                .filter((label) =>
                    label.name.toLowerCase().includes(searchTerm.toLowerCase())
                )
                .map(({ name, id }) => (
                    <li
                        key={id}
                        className={`list-group-item d-flex justify-content-between align-items-center ${
                            darkTheme
                                ? "bg-dark text-light"
                                : "bg-light text-dark"
                        }`}
                    >
                        {editingLabel === name ? (
                            <>
                                <input
                                    type="text"
                                    className={`form-control form-control-sm me-2 ${
                                        darkTheme ? "bg-dark text-light border-light" : ""
                                    }`}
                                    value={newLabelName}
                                    onChange={(e) =>
                                        setNewLabelName(e.target.value)
                                    }
                                />
                                <button
                                    className={`btn btn-sm ${
                                        darkTheme
                                            ? "btn-success"
                                            : "btn-outline-success"
                                    } me-2`}
                                    onClick={() => handleEditLabel(id)}
                                >
                                    <span className="material-symbols-rounded">
                                        done
                                    </span>
                                </button>
                            </>
                        ) : (
                            <>
                                {name}
                                <div className="d-flex gap-2">
                                    <button
                                        className={`btn btn-sm ${
                                            darkTheme
                                                ? "btn-primary"
                                                : "btn-outline-primary"
                                        }`}
                                        onClick={() => {
                                            setEditingLabel(name);
                                            setNewLabelName(name);
                                        }}
                                    >
                                        <span className="material-symbols-rounded">
                                            edit
                                        </span>
                                    </button>
                                    <button
                                        className={`btn btn-sm ${
                                            darkTheme
                                                ? "btn-danger"
                                                : "btn-outline-danger"
                                        }`}
                                        onClick={() => deleteLabel(id)}
                                    >
                                        <span className="material-symbols-rounded">
                                            delete
                                        </span>
                                    </button>
                                </div>
                            </>
                        )}
                    </li>
                ))}
        </ul>
    );
}
