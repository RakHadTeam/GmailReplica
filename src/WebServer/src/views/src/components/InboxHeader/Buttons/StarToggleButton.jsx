import { useMemo, useState } from "react";
import { useMailApp } from "../../../context/MailAppContext.js";
import { useLabelActions } from "../../../hooks/useLabelActions.js";
import { useStarActions } from "../../../hooks/useStarActions.js";

export default function StarToggleButton() {
    const {
        uiState: { selectedIds },
    } = useMailApp();
    const { getLabel } = useLabelActions();
    const { toggleStarBulk } = useStarActions();

    const [starred, setStarred] = useState(false);

    useMemo(() => {
        const starredLabel = getLabel("Starred");
        const allStarred = selectedIds.every((id) =>
            starredLabel.mails.includes(id)
        );
        setStarred(allStarred);
    }, [selectedIds, getLabel]);
    return (
        <span
            className={`icon-button me-3 fs-5 ${
                starred ? "text-warning" : ""
            }`}
            style={{ cursor: "pointer" }}
            onClick={() => toggleStarBulk()}
        >
            {starred ? "★" : "☆"}
        </span>
    );
}
