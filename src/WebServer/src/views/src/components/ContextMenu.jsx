import useMailHandlers from "../hooks/useMailHandlers.js";
import useStarHandlers from "../hooks/useStarHandlers.js";
import useUiState from "../hooks/useUIStates.js";
import LabelPopup from "./LabelPopup";

export default function ContextMenu() {
    const { contextMenu, menuRef, showLabelPopup, setShowLabelPopup } =
        useUiState();
    const { handleDelete } = useMailHandlers();
    const { handleToggleStar } = useStarHandlers();

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
            <button
                className="btn btn-light w-100 text-start d-flex align-items-center gap-2"
                onClick={() => handleDelete(contextMenu.mailId)}
            >
                <span className="material-symbols-rounded">delete</span>
                Delete
            </button>
            <button
                className="btn btn-light w-100 text-start d-flex align-items-center gap-2"
                onClick={() => handleToggleStar(contextMenu.mailId)}
            >
                <span className="material-symbols-rounded">star</span>
                Star
            </button>
            <div
                onMouseEnter={() => setShowLabelPopup(true)}
                onMouseLeave={() => setShowLabelPopup(false)}
                className="position-relative"
            >
                <button className="btn btn-light w-100 text-start d-flex align-items-center gap-2">
                    <span className="material-symbols-rounded">label</span>
                    Add Label
                </button>
                {showLabelPopup && (
                    <div
                        className="position-absolute"
                        style={{ top: 0, left: "100%" }}
                    >
                        <LabelPopup position={{ x: 0, y: 0 }} />
                    </div>
                )}
            </div>
        </div>
    );
}
