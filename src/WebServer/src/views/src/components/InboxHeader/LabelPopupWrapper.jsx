import LabelPopup from "../LabelPopup/LabelPopup";

export default function LabelPopupWrapper({ toggleLabelPopup, toggleLabelManager }) {
    return (
        <div className="position-absolute">
            <LabelPopup
                onClose={toggleLabelPopup}
                position={{ x: 170, y: -16 }}
                onManageClick={toggleLabelManager}
            />
        </div>
    );
}
