import { useMailActions } from "../../../hooks/useMailActions";

export default function UnBinButton() {
    const { unbinBulk } = useMailActions();
    return (
        <label
            className="material-symbols-rounded icon-button me-3 text-danger"
            style={{ cursor: "pointer" }}
            onClick={() => unbinBulk()}
        >
            restore_from_trash
        </label>
    );
}
