import { useMailApp } from "../context/MailAppContext";
import { useLabelActions } from "./useLabelActions";

export function useStarActions() {
    const {
        uiState: { selectedIds },
    } = useMailApp();

    const { toggleLabel, toggleLabelBulk } = useLabelActions();

    const toggleStar = (mailId) => toggleLabel("Starred", mailId);

    const toggleStarBulk = (apply) => {
        toggleLabelBulk("Starred", selectedIds, apply);
    };

    return { toggleStar, toggleStarBulk };
}
