import useLabels from "../../../hooks/useLabels";
import useMails from "../../../hooks/useMails";
import useSpamHandlers from "../../../hooks/useSpamHandlers";

export default function SpamButton() {
    const { selectedMails } = useMails();
    const { spammedIds } = useLabels();
    const { handleToggleSpamBulk } = useSpamHandlers();

    const someSelectedMailsAreSpammed = selectedMails.some((id) =>
        spammedIds.includes(id)
    );

    return (
        <span
            className="material-symbols-rounded icon-button me-3"
            style={{ cursor: "pointer" }}
            onClick={() => handleToggleSpamBulk()}
        >
            {someSelectedMailsAreSpammed ? "report_off" : "report"}
        </span>
    );
}
