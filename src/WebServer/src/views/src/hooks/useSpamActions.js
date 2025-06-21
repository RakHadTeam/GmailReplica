// src/hooks/useSpamActions.js
import { useMailApp } from "../context/MailAppContext";
import { useLabelActions } from "./useLabelActions";

export function useSpamActions() {
    const {
        uiState: { selectedIds, setSelectedIds },
    } = useMailApp();

    const { toggleLabel, toggleLabelBulk } = useLabelActions();

    const toggleSpam = (mailId) => toggleLabel("Spam", mailId);

    const toggleSpamBulk = () => {
        toggleLabelBulk("Spam", selectedIds);
    };

    return { toggleSpam, toggleSpamBulk };
}
