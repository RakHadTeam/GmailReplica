import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext.jsx";
import useLabels from "../hooks/useLabels.js";
import useUiState from "../hooks/useUIStates.js";

export default function LabelManager() {
    const { setLabels } = useLabels();
    const { toggleLabelManager } = useUiState();
    const { darkTheme } = useTheme();
    const [searchTerm, setSearchTerm] = useState("");
    const navigate = useNavigate();
    const { labels, fetchLabels } = useLabels();
    const [showCreatePrompt, setShowCreatePrompt] = useState(false);
    const [newLabel, setNewLabel] = useState("");
    const [error, setError] = useState("");

    const popupRef = useRef(null);

    useEffect(() => {
        function handleClickOutside(event) {
            if (popupRef.current && !popupRef.current.contains(event.target)) {
                toggleLabelManager();
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleCreateLabel = async () => {
        const name = newLabel.trim();
        if (!name) {
            setError("Label name cannot be empty.");
            return;
        }

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
            await fetchLabels();
            setNewLabel("");
            setSearchTerm("");
            setShowCreatePrompt(false);
        } catch (err) {
            console.error(err);
            setError("Could not create label");
        }
    };

    const handleDeleteLabel = async (id) => {
        try {
            const res = await fetch(`/api/labels/${id}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            if (!res.ok) throw new Error("Failed to delete label");
            setLabels(labels.filter((label) => label.id !== id));
        } catch (err) {
            console.error(err);
            setError("Error deleting label.");
        }
    };

    return (
        <div
            className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center"
            style={{ zIndex: 1050 }}
        >
            <div
                ref={popupRef}
                className={`p-4 rounded shadow border ${
                    darkTheme ? "bg-dark text-white" : "bg-white text-dark"
                }`}
            >
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <h5 className="m-0">Manage Labels</h5>
                    <button
                        className="btn-close"
                        aria-label="Close"
                        onClick={toggleLabelManager}
                    ></button>
                </div>

                <div className="input-group mb-3">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="New label name"
                        value={newLabel}
                        onChange={(e) => setNewLabel(e.target.value)}
                    />
                    <button
                        className="btn btn-primary"
                        onClick={handleCreateLabel}
                    >
                        Add
                    </button>
                </div>

                <div className="input-group mb-3">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Search labels..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                {error && (
                    <div className="alert alert-danger py-1">{error}</div>
                )}

                <ul className="list-group">
                    {labels
                        .filter(
                            (label) => label.name.toLowerCase() !== "starred"
                        )
                        .filter((label) =>
                            label.name
                                .toLowerCase()
                                .includes(searchTerm.toLowerCase())
                        )
                        .map(({ id, name }) => (
                            <li
                                key={id}
                                className="list-group-item d-flex justify-content-between align-items-center"
                            >
                                {name}
                                <button
                                    className="btn btn-sm btn-outline-danger"
                                    onClick={() => handleDeleteLabel(id)}
                                >
                                    <span className="material-symbols-rounded">
                                        delete
                                    </span>
                                </button>
                            </li>
                        ))}
                </ul>
            </div>
        </div>
    );
}
