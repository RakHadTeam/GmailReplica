import { useLabelActions } from "../../hooks/useLabelActions.js";

export default function LabelManagerInput({
    newLabel,
    setNewLabel,
    searchTerm,
    setSearchTerm,
    setError,
}) {
    const { createLabel } = useLabelActions();

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
            <div className="input-group mb-3">
                <input
                    type="text"
                    className="form-control"
                    placeholder="New label name"
                    value={newLabel}
                    onChange={(e) => setNewLabel(e.target.value)}
                />
                <button className="btn btn-primary" onClick={handleCreateLabel}>
                    Add
                </button>
            </div>

            <div className="input-group mb-3">
                <span className="input-group-text bg-transparent border-end-0">
                    <span className="material-symbols-rounded">search</span>
                </span>
                <input
                    type="text"
                    className="form-control border-start-0"
                    placeholder="Search labels..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
        </>
    );
}
