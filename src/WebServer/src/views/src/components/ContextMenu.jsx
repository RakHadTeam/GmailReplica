import { useState } from "react";
import useMailHandlers from "../hooks/useMailHandlers.js";
import useStarHandlers from "../hooks/useStarHandlers.js";
import useUIs from "../hooks/useUIs.js";
import LabelPopup from "./LabelPopup";
import useLabels from "../hooks/useLabels.js";

export default function ContextMenu() {
    const { contextMenu, menuRef } = useUIs();
    const { handleDeleteBulk, handleUnbinBulk } = useMailHandlers();
    const { handleToggleStarBulk } = useStarHandlers();
    const { activeLabel } = useLabels();
    const [showLabelPopupMenu, setShowLabelPopupMenu] = useState(false);

    const closeLabelPopupMenu = () => {
        setShowLabelPopupMenu(false);
    };

    if (!contextMenu) return null;

    return (
        <div
            ref={menuRef}
            className="shadow bg-white border rounded"
            style={{
                position: "absolute",
                top: contextMenu.y,
                left: contextMenu.x,
                zIndex: 1000,
                width: 200,
            }}
        >
            {activeLabel !== "Bin" ? (
                <button
                    className="btn btn-light w-100 text-start d-flex align-items-center gap-2"
                    onClick={() => handleDeleteBulk()}
                >
                    <span className="material-symbols-rounded">
                        delete_forever
                    </span>
                    Move to Bin
                </button>
            ) : (
                <>
                    <button
                        className="btn btn-light w-100 text-start d-flex align-items-center gap-2"
                        onClick={() => handleDeleteBulk()}
                    >
                        <span className="material-symbols-rounded">
                            delete_forever
                        </span>
                        Delete Forever
                    </button>
                    <button
                        className="btn btn-light w-100 text-start d-flex align-items-center gap-2"
                        onClick={() => handleUnbinBulk()}
                    >
                        <span className="material-symbols-rounded">
                            restore_from_trash
                        </span>
                        Unbin
                    </button>
                </>
            )}
            <button
                className="btn btn-light w-100 text-start d-flex align-items-center gap-2"
                onClick={() => handleToggleStarBulk()}
            >
                <span className="material-symbols-rounded">star</span>
                Star
            </button>
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
                            closeLabelPopup={closeLabelPopupMenu}
                            position={{ x: 0, y: 0 }}
                        />
                    </div>
                )}
            </div>
        </div>
    );
}
