// src/hooks/useStarActions.js
import { useMailApp } from "../context/MailAppContext";
import { useLabelActions } from "./useLabelActions";

export function useStarActions() {
    const {
        uiState: { selectedIds, setSelectedIds },
    } = useMailApp();

    const { toggleLabel, toggleLabelBulk } = useLabelActions();

    const toggleStar = (mailId) => toggleLabel("Starred", mailId);

    const toggleStarBulk = async () => {
        await toggleLabelBulk("Starred", selectedIds);
        setSelectedIds([]);
    };

    return { toggleStar, toggleStarBulk };
}
