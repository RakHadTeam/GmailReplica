import LabelPopup from "../LabelPopup/LabelPopup";

export default function LabelPopupWrapper({ toggleLabelPopup }) {
    return (
        <div className="position-absolute">
            <LabelPopup
                toggleLabelPopup={toggleLabelPopup}
                position={{ x: 200, y: -25 }}
            />
        </div>
    );
}
