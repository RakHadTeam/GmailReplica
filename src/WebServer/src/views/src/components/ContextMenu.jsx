import useLabels from "../hooks/useLabels.js";
import LabelPopup from "./LabelPopup";

export default function ContextMenu({
    contextMenu,
    menuRef,
    handleDelete,
    handleToggleStar,
    selectedMails,
    handleLabelToggle,
    showLabelMenu,
    setShowLabelMenu,
}) {
    const { labels } = useLabels();

    if (!contextMenu) return null;
    const targets = selectedMails.length ? selectedMails : [contextMenu.mailId];

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
                onMouseEnter={() => setShowLabelMenu(true)}
                onMouseLeave={() => setShowLabelMenu(false)}
                className="position-relative"
            >
                <button className="btn btn-light w-100 text-start d-flex align-items-center gap-2">
                    <span className="material-symbols-rounded">label</span>
                    Add Label
                </button>
                {showLabelMenu && (
                    <div
                        className="position-absolute"
                        style={{ top: 0, left: "100%" }}
                    >
                        <LabelPopup
                            labels={labels}
                            selectedMails={targets}
                            handleLabelToggle={handleLabelToggle}
                            position={{ x: 0, y: 0 }}
                        />
                    </div>
                )}
            </div>
        </div>
    );
}
