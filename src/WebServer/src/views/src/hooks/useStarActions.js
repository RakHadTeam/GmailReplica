import { useMailApp } from "../context/MailAppContext";
import { useLabelActions } from "./useLabelActions";

export function useStarActions() {
    const {
        uiState: { selectedIds },
    } = useMailApp();

    const { toggleLabel, toggleLabelBulk } = useLabelActions();
    const { getLabelByName } = useLabelActions();

    const starredLabel = getLabelByName("Starred");

    const toggleStar = (mailId) => toggleLabel(starredLabel.id, mailId);

    const toggleStarBulk = (apply) => {
        toggleLabelBulk(starredLabel.id, selectedIds, apply);
    };

    return { toggleStar, toggleStarBulk };
}
