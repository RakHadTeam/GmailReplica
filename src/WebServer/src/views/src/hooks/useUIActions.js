import { useMailApp } from "../context/MailAppContext";

export function useUIActions() {
    const {
        uiState: { selectedIds, setSelectedIds, setActiveLabel },
        filteredMails,
    } = useMailApp();

    const selectAll = () => {
        const allIds = filteredMails.map((mail) => mail.id);
        setSelectedIds(allIds);
    };

    const deselectAll = () => {
        setSelectedIds([]);
    };

    const toggleSelect = (id) => {
        setSelectedIds((prev) =>
            prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
        );
    };

    const isSelected = (id) => selectedIds.includes(id);

    const setLabel = (labelId) => {
        setActiveLabel(labelId);
    };

    return {
        selectedIds,
        selectAll,
        deselectAll,
        toggleSelect,
        isSelected,
        setLabel,
        setSelectedIds,
    };
}
