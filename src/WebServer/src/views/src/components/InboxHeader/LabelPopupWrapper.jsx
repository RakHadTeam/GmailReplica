import LabelPopup from "../LabelPopup/LabelPopup";

export default function LabelPopupWrapper({ toggleLabelPopup, toggleLabelManager }) {
    return (
        <div className="position-absolute">
            <LabelPopup
                onClose={toggleLabelPopup}
                position={{ x: 225, y: -20 }}
                onManageClick={toggleLabelManager}
            />
        </div>
    );
}
