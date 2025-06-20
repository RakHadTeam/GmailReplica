import useUIs from "../../../hooks/useUIs";

export default function LabelButton() {
    const { setShowLabelPopup } = useUIs();

    return (
        <span
            className="material-symbols-rounded icon-button me-3"
            style={{ cursor: "pointer" }}
            onClick={() => setShowLabelPopup(true)}
        >
            label
        </span>
    );
}
