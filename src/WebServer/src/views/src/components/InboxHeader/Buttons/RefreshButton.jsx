import useLabels from "../../../hooks/useLabels";
import useMails from "../../../hooks/useMails";

export default function RefreshButton() {
    const { fetchLabels } = useLabels();
    const { fetchMails } = useMails();

    return (
        <span
            className="material-symbols-rounded icon-button me-3"
            style={{ cursor: "pointer" }}
            onClick={() => {
                fetchMails();
                fetchLabels();
            }}
        >
            refresh
        </span>
    );
}
