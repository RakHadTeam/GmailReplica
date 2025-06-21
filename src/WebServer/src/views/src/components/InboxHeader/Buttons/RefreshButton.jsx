import { useLabelActions } from "../../../hooks/useLabelActions.js";
import { useMailActions } from "../../../hooks/useMailActions.js";

export default function RefreshButton() {
    const { fetchLabels } = useLabelActions();
    const { fetchMails } = useMailActions();

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
