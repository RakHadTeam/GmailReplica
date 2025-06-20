export default function SettingsHeader({ onClose }) {
    return (
        <div className="d-flex justify-content-between align-items-center mb-4">
            <div className="d-flex align-items-center gap-2">
                <span
                    className="material-symbols-rounded"
                    style={{ fontSize: "1.5rem" }}
                >
                    settings
                </span>
                <h5 className="mb-0">Settings</h5>
            </div>
            <button className="btn-close" onClick={onClose}></button>
        </div>
    );
}
