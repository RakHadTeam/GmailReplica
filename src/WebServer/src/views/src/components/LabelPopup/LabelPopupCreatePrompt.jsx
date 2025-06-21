export default function LabelPopupCreatePrompt({
    newLabel,
    setNewLabel,
    onCreate,
    onCancel,
    error,
}) {
    return (
        <div
            className="position-absolute top-0 start-0 w-100 h-100 bg-dark bg-opacity-25 d-flex justify-content-center align-items-center"
            style={{ zIndex: 10000 }}
        >
            <div
                className="p-4 rounded shadow border bg-white text-dark dark:bg-dark dark:text-white"
                style={{ width: "300px" }}
            >
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <h6 className="m-0">Create New Label</h6>
                    <button
                        className="btn-close btn-close-white"
                        onClick={() => onCancel()}
                    ></button>
                </div>
                {error && (
                    <div className="alert alert-danger py-1">{error}</div>
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
                        onClick={() => onCancel()}
                    >
                        Cancel
                    </button>
                    <button
                        className="btn btn-primary btn-sm"
                        onClick={() => onCreate()}
                    >
                        Create
                    </button>
                </div>
            </div>
        </div>
    );
}
