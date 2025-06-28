import { useMailApp } from "../context/MailAppContext";
import { useLabelActions } from "./useLabelActions";

export function useSpamActions() {
    const {
        uiState: { selectedIds, setSelectedIds },
    } = useMailApp();

    const { toggleLabel, toggleLabelBulk } = useLabelActions();
    const { getLabelByName } = useLabelActions();

    const spamLabel = getLabelByName("Spam");

    const toggleSpam = (mailId) => toggleLabel(spamLabel.id, mailId);

    const toggleSpamBulk = (apply) => {
        toggleLabelBulk(spamLabel.id, selectedIds, apply);
        setSelectedIds([]); // Clear selected IDs after toggling
    };

    return { toggleSpam, toggleSpamBulk };
}
