import { useState } from "react";
import LabelManager from "../LabelManager/LabelManager.jsx";
import LabelPopup from "../LabelPopup/LabelPopup.jsx";

export default function ContextMenuLabel() {
    const [showLabelPopupMenu, setShowLabelPopupMenu] = useState(false);
    const [showLabelManager, setShowLabelManager] = useState(false);

    const toggleLabelPopup = () => {
        setShowLabelPopupMenu((prev) => !prev);
    };

    const toggleLabelManager = () => {
        setShowLabelManager((prev) => !prev);
        setShowLabelPopupMenu(false);
    };

    return (
        <div
            onMouseEnter={() => setShowLabelPopupMenu(true)}
            onMouseLeave={() => setShowLabelPopupMenu(false)}
            className="position-relative"
        >
            <button className="btn btn-light w-100 text-start d-flex align-items-center gap-2">
                <span className="material-symbols-rounded">label</span>
                Set Labels
            </button>
            {showLabelPopupMenu && (
                <div
                    className="position-absolute"
                    style={{ top: 0, left: "100%" }}
                >
                    <LabelPopup
                        onClose={toggleLabelPopup}
                        onManageClick={toggleLabelManager}
                        position={{ x: 0, y: 0 }}
                    />
                </div>
            )}
            {showLabelManager && <LabelManager onClose={toggleLabelManager} />}
        </div>
    );
}
