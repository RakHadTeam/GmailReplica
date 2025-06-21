export default function BackButton({ onClose }) {
    return (
        <span
            className="material-symbols-rounded icon-button me-3"
            style={{ cursor: "pointer" }}
            onClick={onClose}
        >
            arrow_back
        </span>
    );
}
