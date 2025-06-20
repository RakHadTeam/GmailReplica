import useUIs from "../../hooks/useUIs";
import LabelPopup from "../LabelPopup/LabelPopup";

export default function LabelPopupWrapper() {
    const { showLabelPopup, setShowLabelPopup } = useUIs();

    if (!showLabelPopup) return null;

    return (
        <div className="position-absolute">
            <LabelPopup
                closeLabelPopup={() => setShowLabelPopup(false)}
                position={{ x: 200, y: -25 }}
            />
        </div>
    );
}
