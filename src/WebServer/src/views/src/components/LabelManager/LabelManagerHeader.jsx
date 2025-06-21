export default function LabelManagerHeader({ onClose }) {
    return (
        <div className="d-flex justify-content-between align-items-center mb-3">
            <h5 className="m-0">Manage Labels</h5>
            <button
                className="btn-close"
                aria-label="Close"
                onClick={onClose}
            ></button>
        </div>
    );
}
