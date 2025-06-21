import { useMailApp } from "../../../context/MailAppContext.js";
import { useUIActions } from "../../../hooks/useUIActions.js";

export default function SelectAllButton() {
    const {
        uiState: { selectedIds },
        filteredMails,
    } = useMailApp();
    const { selectAll, deselectAll } = useUIActions();

    const handleClick = () => {
        if (
            selectedIds.length === filteredMails.length ||
            selectedIds.length > 0
        ) {
            deselectAll();
        } else {
            selectAll();
        }
    };

    const icon =
        selectedIds.length === 0
            ? "check_box_outline_blank"
            : selectedIds.length === filteredMails.length
            ? "check_box"
            : "indeterminate_check_box";

    return (
        <span
            className="material-symbols-rounded icon-button me-3"
            style={{ cursor: "pointer" }}
            onClick={handleClick}
        >
            {icon}
        </span>
    );
}
