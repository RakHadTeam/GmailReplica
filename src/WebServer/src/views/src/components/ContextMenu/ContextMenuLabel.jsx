import { useState } from "react";
import LabelPopup from "../LabelPopup/LabelPopup";

export default function ContextMenuLabel() {
    const [showLabelPopupMenu, setShowLabelPopupMenu] = useState(false);

    return (
        <div
            onMouseEnter={() => setShowLabelPopupMenu(true)}
            onMouseLeave={() => setShowLabelPopupMenu(false)}
            className="position-relative"
        >
            <button className="btn btn-light w-100 text-start d-flex align-items-center gap-2">
                <span className="material-symbols-rounded">label</span>
                Add Label
            </button>
            {showLabelPopupMenu && (
                <div
                    className="position-absolute"
                    style={{ top: 0, left: "100%" }}
                >
                    <LabelPopup
                        closeLabelPopup={() => setShowLabelPopupMenu(false)}
                        position={{ x: 0, y: 0 }}
                    />
                </div>
            )}
        </div>
    );
}
