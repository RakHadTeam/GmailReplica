export default function LabelButton({ toggleLabelPopup }) {
    return (
        <span
            className="material-symbols-rounded icon-button me-3"
            style={{ cursor: "pointer" }}
            onClick={toggleLabelPopup}
        >
            label
        </span>
    );
}
