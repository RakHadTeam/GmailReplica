import { useMailApp } from "../../../context/MailAppContext.js";
import { useLabelActions } from "../../../hooks/useLabelActions.js";
import { useSpamActions } from "../../../hooks/useSpamActions.js";

export default function SpamButton() {
    const {
        uiState: { selectedIds },
    } = useMailApp();
    const { getLabel } = useLabelActions();
    const { toggleSpamBulk } = useSpamActions();

    const spamLabel = getLabel("Spam");

    const someSelectedMailsAreSpammed = selectedIds.some((id) =>
        spamLabel.mails.includes(id)
    );

    return (
        <span
            className="material-symbols-rounded icon-button me-3"
            style={{ cursor: "pointer" }}
            onClick={toggleSpamBulk}
        >
            {someSelectedMailsAreSpammed ? "report_off" : "report"}
        </span>
    );
}
