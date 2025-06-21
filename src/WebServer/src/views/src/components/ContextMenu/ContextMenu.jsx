import { useEffect, useRef } from "react";
import { useMailApp } from "../../context/MailAppContext";
import { useMailActions } from "../../hooks/useMailActions";
import { useSpamActions } from "../../hooks/useSpamActions";
import { useStarActions } from "../../hooks/useStarActions";
import ContextMenuItem from "./ContextMenuItem";
import ContextMenuLabel from "./ContextMenuLabel";

export default function ContextMenu({ contextMenu, onClose }) {
    const {
        uiState: { selectedIds, activeLabel },
        labelState: { labels },
    } = useMailApp();

    const { deleteBulk, unbinBulk } = useMailActions();
    const { toggleStarBulk } = useStarActions();
    const { toggleSpamBulk } = useSpamActions();
    const contextRef = useRef(null);

    const starredLabel = labels.find((l) => l.name === "Starred");
    const spamLabel = labels.find((l) => l.name === "Spam");

    const someSelectedMailsAreStarred = selectedIds.some((id) =>
        starredLabel?.mails?.includes(id)
    );
    const someSelectedMailsAreSpammed = selectedIds.some((id) =>
        spamLabel?.mails?.includes(id)
    );

    const handleClick = (e, operation, apply) => {
        e.preventDefault();
        operation(apply);
        onClose();
    };

    useEffect(() => {
        function handleClickOutside(event) {
            if (
                contextRef.current &&
                !contextRef.current.contains(event.target)
            ) {
                onClose();
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [onClose]);

    return (
        <div
            ref={contextRef}
            className="shadow bg-white border rounded"
            style={{
                position: "absolute",
                top: contextMenu.y - 130,
                left: contextMenu.x - 250,
                zIndex: 1000,
                width: 200,
            }}
        >
            {activeLabel !== "Bin" ? (
                <ContextMenuItem
                    icon="delete_forever"
                    onClick={(e) => handleClick(e, deleteBulk)}
                    label="Move to Bin"
                />
            ) : (
                <>
                    <ContextMenuItem
                        icon="delete_forever"
                        onClick={(e) => handleClick(e, deleteBulk)}
                        label="Delete Forever"
                    />
                    <ContextMenuItem
                        icon="restore_from_trash"
                        onClick={(e) => handleClick(e, unbinBulk)}
                        label="Unbin"
                    />
                </>
            )}
            <ContextMenuItem
                icon="star"
                onClick={(e) =>
                    handleClick(e, toggleStarBulk, !someSelectedMailsAreStarred)
                }
                label={someSelectedMailsAreStarred ? "Unstar" : "Star"}
            />
            <ContextMenuItem
                icon="report"
                onClick={(e) =>
                    handleClick(e, toggleSpamBulk, !someSelectedMailsAreSpammed)
                }
                label={
                    someSelectedMailsAreSpammed
                        ? "Mark as not Spam"
                        : "Mark as Spam"
                }
            />
            <ContextMenuLabel />
        </div>
    );
}
