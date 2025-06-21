export default function LabelButton({ onClick }) {
    return (
        <span
            className="material-symbols-rounded icon-button me-3"
            style={{ cursor: "pointer" }}
            onClick={onClick}
        >
            label
        </span>
    );
}
