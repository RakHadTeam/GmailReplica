import { useLabelActions } from "../../hooks/useLabelActions.js";
import { useTheme } from "../../context/ThemeContext.js";

export default function LabelManagerInput({
    newLabel,
    setNewLabel,
    searchTerm,
    setSearchTerm,
    setError,
}) {
    const { createLabel } = useLabelActions();
    const { darkTheme } = useTheme();

    const handleCreateLabel = async () => {
        if (!newLabel) return;
        try {
            await createLabel(newLabel);
            setNewLabel("");
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <>
            {darkTheme && (
                <label
                    className={`small ${
                        darkTheme ? "text-white" : "text-dark"
                    }`}
                >
                    Add New Label
                </label>
            )}
            <div className="input-group mb-3">
                <input
                    type="text"
                    className={`form-control ${
                        darkTheme ? "bg-dark text-light border-secondary" : ""
                    }`}
                    style={darkTheme ? { color: "white" } : {}}
                    placeholder="New label name"
                    value={newLabel}
                    onChange={(e) => setNewLabel(e.target.value)}
                />
                <button
                    className={`btn ${
                        darkTheme ? "btn-primary" : "btn-outline-primary"
                    }`}
                    onClick={handleCreateLabel}
                >
                    Add
                </button>
            </div>
            {darkTheme && (
                <label
                    className={`small ${
                        darkTheme ? "text-white" : "text-dark"
                    }`}
                >
                    Search Labels
                </label>
            )}
            <div className="input-group mb-3">
                <span
                    className={`input-group-text ${
                        darkTheme
                            ? "bg-dark text-light border-secondary"
                            : "bg-transparent border-end-0"
                    }`}
                >
                    <span className="material-symbols-rounded">search</span>
                </span>
                <input
                    type="text"
                    className={`form-control ${
                        darkTheme
                            ? "bg-dark text-light border-secondary"
                            : "border-start-0"
                    }`}
                    style={darkTheme ? { color: "white" } : {}}
                    placeholder="Search labels..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
        </>
    );
}
