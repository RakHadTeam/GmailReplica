import useLabels from "../../../hooks/useLabels";
import useMails from "../../../hooks/useMails";
import useStarHandlers from "../../../hooks/useStarHandlers";

export default function StarToggleButton() {
    const { handleToggleStarBulk } = useStarHandlers();
    const { selectedMails } = useMails();
    const { starredIds } = useLabels();

    const allStarred =
        selectedMails.length > 0 &&
        selectedMails.every((id) => starredIds.includes(id));

    return (
        <span
            className={`icon-button me-3 fs-5 ${
                allStarred ? "text-warning" : ""
            }`}
            style={{ cursor: "pointer" }}
            onClick={() => handleToggleStarBulk()}
        >
            {allStarred ? "★" : "☆"}
        </span>
    );
}
