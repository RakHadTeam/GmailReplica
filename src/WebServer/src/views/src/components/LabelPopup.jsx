// src/components/LabelManager.jsx
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import useLabels from "../hooks/useLabels.js";

export default function LabelPopup({
    onClose,
    position,
    handleLabelToggle,
    toggleLabelManager,
}) {
    const { darkTheme } = useTheme();
    const { labels, fetchLabels } = useLabels();
    const [newLabel, setNewLabel] = useState("");
    const [error, setError] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [showCreatePrompt, setShowCreatePrompt] = useState(false);
    const navigate = useNavigate();
    const popupRef = useRef(null);

    useEffect(() => {
        function handleClickOutside(event) {
            if (popupRef.current && !popupRef.current.contains(event.target)) {
                onClose();
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    // Helper to reload labels from server
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
            await fetchLabels();
            setNewLabel("");
            setSearchTerm("");
            setShowCreatePrompt(false);
        } catch (err) {
            console.error(err);
            setError("Could not create label");
        }
    };

    const filteredLabels = labels.filter(
        ({ name }) =>
            name.toLowerCase().includes(searchTerm.toLowerCase()) &&
            name.toLowerCase() !== "starred"
    );

    return (
        <div
            ref={popupRef}
            className="position-absolute"
            style={{
                top: position.y,
                left: position.x,
                zIndex: 100,
            }}
        >
            <div
                className={`rounded shadow border overflow-hidden ${
                    darkTheme ? "bg-dark text-white" : "bg-white text-dark"
                }`}
                style={{ width: "320px" }}
            >
                <div className="d-flex justify-content-between align-items-center p-3 border-bottom">
                    <h5 className="m-0">Labels</h5>
                    <button className="btn-close" onClick={onClose}></button>
                </div>

                {error && (
                    <div className="alert alert-danger py-1 mb-3 mx-3">
                        {error}
                    </div>
                )}

                <div className="input-group input-group-sm mb-2 mx-3 mt-3">
                    <span className="input-group-text bg-transparent border-end-0">
                        <span className="material-symbols-rounded">search</span>
                    </span>
                    <input
                        type="text"
                        className="form-control border-start-0"
                        style={{ maxWidth: "220px" }}
                        placeholder="Search labels"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div
                    className="list-group list-group-flush mb-2 mx-3"
                    style={{ maxHeight: "250px", overflowY: "auto" }}
                >
                    {filteredLabels.map(({ id, name }) => (
                        <label
                            key={id}
                            className="list-group-item d-flex align-items-center"
                        >
                            <div className="d-flex align-items-center gap-2">
                                <input
                                    type="checkbox"
                                    className="form-check-input"
                                    onChange={(e) => handleLabelToggle(id)}
                                />
                                {name}
                            </div>
                        </label>
                    ))}
                </div>

                <div className="border-top pt-2 mx-3 mb-3">
                    <button
                        className="btn btn-link text-decoration-none w-100 text-start"
                        onClick={() => setShowCreatePrompt(true)}
                    >
                        Create new
                    </button>
                    <button
                        className="btn btn-link text-decoration-none w-100 text-start"
                        onClick={toggleLabelManager}
                    >
                        Manage labels
                    </button>
                </div>
            </div>
            {showCreatePrompt && (
                <div
                    className="position-absolute top-0 start-0 w-100 h-100 bg-dark bg-opacity-25 d-flex justify-content-center align-items-center"
                    style={{ zIndex: 10000 }}
                >
                    <div
                        className={`p-4 rounded shadow border ${
                            darkTheme
                                ? "bg-dark text-white"
                                : "bg-white text-dark"
                        }`}
                        style={{ width: "300px" }}
                    >
                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <h6 className="m-0">Create New Label</h6>
                            <button
                                className="btn-close btn-close-white"
                                onClick={() => setShowCreatePrompt(false)}
                            ></button>
                        </div>
                        {error && (
                            <div className="alert alert-danger py-1">
                                {error}
                            </div>
                        )}
                        <input
                            type="text"
                            className="form-control mb-3"
                            placeholder="Label name"
                            value={newLabel}
                            onChange={(e) => setNewLabel(e.target.value)}
                        />
                        <div className="d-flex justify-content-end gap-2">
                            <button
                                className="btn btn-secondary btn-sm"
                                onClick={() => setShowCreatePrompt(false)}
                            >
                                Cancel
                            </button>
                            <button
                                className="btn btn-primary btn-sm"
                                onClick={async () => {
                                    await createLabel();
                                }}
                            >
                                Create
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
