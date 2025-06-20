import { useState } from "react";
import useMailHandlers from "../../hooks/useMailHandlers.js";
import useStarHandlers from "../../hooks/useStarHandlers.js";
import useUIs from "../../hooks/useUIs.js";
import LabelPopup from "../LabelPopup/LabelPopup.jsx";
import useLabels from "../../hooks/useLabels.js";
import useSpamHandlers from "../../hooks/useSpamHandlers.js";
import useMails from "../../hooks/useMails.js";
import ContextMenuItem from "./ContextMenuItem";
import ContextMenuLabel from "./ContextMenuLabel";

export default function ContextMenu() {
    const { contextMenu, menuRef } = useUIs();
    const { handleDeleteBulk, handleUnbinBulk } = useMailHandlers();
    const { handleToggleStarBulk } = useStarHandlers();
    const { activeLabel, spammedIds, starredIds } = useLabels();
    const { selectedMails } = useMails();
    const [showLabelPopupMenu, setShowLabelPopupMenu] = useState(false);
    const { handleToggleSpamBulk } = useSpamHandlers();

    const someSelectedMailsAreSpammed = selectedMails.some((id) =>
        spammedIds.includes(id)
    );
    const someSelectedMailsAreStarred = selectedMails.some((id) =>
        starredIds.includes(id)
    );
    const show = Boolean(contextMenu);
    const closeLabelPopupMenu = () => setShowLabelPopupMenu(false);

    if (!show) return null;

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
                <ContextMenuItem
                    icon="delete_forever"
                    onClick={handleDeleteBulk}
                    label="Move to Bin"
                />
            ) : (
                <>
                    <ContextMenuItem
                        icon="delete_forever"
                        onClick={handleDeleteBulk}
                        label="Delete Forever"
                    />
                    <ContextMenuItem
                        icon="restore_from_trash"
                        onClick={handleUnbinBulk}
                        label="Unbin"
                    />
                </>
            )}
            <ContextMenuItem
                icon="star"
                onClick={handleToggleStarBulk}
                label={someSelectedMailsAreStarred ? "Unstar" : "Star"}
            />
            <ContextMenuItem
                icon="report"
                onClick={handleToggleSpamBulk}
                label={
                    someSelectedMailsAreSpammed
                        ? "Mark as not Spam"
                        : "Mark as Spam"
                }
            />
            <ContextMenuLabel
                showLabelPopupMenu={showLabelPopupMenu}
                setShowLabelPopupMenu={setShowLabelPopupMenu}
                closeLabelPopupMenu={closeLabelPopupMenu}
            />
        </div>
    );
}
