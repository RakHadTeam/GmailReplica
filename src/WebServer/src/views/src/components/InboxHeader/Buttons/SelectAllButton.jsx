import useMails from "../../../hooks/useMails";
import useMailHandlers from "../../../hooks/useMailHandlers";

export default function SelectAllButton() {
    const { selectedMails, filteredMails, setSelectedMails } = useMails();
    const { handleSelectAll } = useMailHandlers();

    const handleClick = () => {
        if (selectedMails.length === filteredMails.length) {
            handleSelectAll();
        } else if (selectedMails.length > 0) {
            setSelectedMails([]);
        } else {
            handleSelectAll();
        }
    };

    const icon =
        selectedMails.length === 0
            ? "check_box_outline_blank"
            : selectedMails.length === filteredMails.length
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
