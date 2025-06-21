// src/hooks/useSpamActions.js
import { useMailApp } from "../context/MailAppContext";
import { useLabelActions } from "./useLabelActions";

export function useSpamActions() {
    const {
        uiState: { selectedIds, setSelectedIds },
    } = useMailApp();

    const { toggleLabel, toggleLabelBulk } = useLabelActions();

    const toggleSpam = (mailId) => toggleLabel("Spam", mailId);

    const toggleSpamBulk = async () => {
        await toggleLabelBulk("Spam", selectedIds);
        setSelectedIds([]);
    };

    return { toggleSpam, toggleSpamBulk };
}
