import { useMemo, useState } from "react";
import { useMailApp } from "../../../context/MailAppContext.js";
import { useLabelActions } from "../../../hooks/useLabelActions.js";
import { useStarActions } from "../../../hooks/useStarActions.js";

export default function StarToggleButton() {
    const {
        uiState: { selectedIds },
    } = useMailApp();
    const { getLabelByName } = useLabelActions();
    const { toggleStarBulk } = useStarActions();

    const [someSelectedMailsAreStarred, setSomeSelectedMailsAreStarred] =
        useState(false);

    useMemo(() => {
        const starredLabel = getLabelByName("Starred");
        setSomeSelectedMailsAreStarred(
            selectedIds.some((id) => starredLabel?.mails?.includes(id))
        );
    }, [selectedIds, getLabelByName]);
    return (
        <span
            className={`icon-button me-3 fs-5 ${
                someSelectedMailsAreStarred ? "text-warning" : ""
            }`}
            style={{ cursor: "pointer" }}
            onClick={() => toggleStarBulk(!someSelectedMailsAreStarred)}
        >
            {someSelectedMailsAreStarred ? "★" : "☆"}
        </span>
    );
}
