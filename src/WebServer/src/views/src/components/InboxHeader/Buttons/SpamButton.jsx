import { useMemo, useState } from "react";
import { useMailApp } from "../../../context/MailAppContext.js";
import { useLabelActions } from "../../../hooks/useLabelActions.js";
import { useSpamActions } from "../../../hooks/useSpamActions.js";

export default function SpamButton() {
    const {
        uiState: { selectedIds, setSelectedIds },
    } = useMailApp();
    const { getLabelByName } = useLabelActions();
    const { toggleSpamBulk } = useSpamActions();
    const [someSelectedMailsAreSpammed, setSomeSelectedMailsAreSpammed] =
        useState(false);

    useMemo(() => {
        const spamLabel = getLabelByName("Spam");
        setSomeSelectedMailsAreSpammed(
            selectedIds.some((id) => spamLabel.mails.includes(id))
        );
    }, [selectedIds, getLabelByName]);

    return (
        <span
            className="material-symbols-rounded icon-button me-3"
            style={{ cursor: "pointer" }}
            onClick={() => {
                toggleSpamBulk(!someSelectedMailsAreSpammed);
            }}
        >
            {someSelectedMailsAreSpammed ? "report_off" : "report"}
        </span>
    );
}
