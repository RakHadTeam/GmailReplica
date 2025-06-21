import { useMailActions } from "../../../hooks/useMailActions.js";

export default function DeleteButton() {
    const { deleteBulk } = useMailActions();

    return (
        <span
            className="material-symbols-rounded icon-button me-3 text-danger"
            style={{ cursor: "pointer" }}
            onClick={() => deleteBulk()}
        >
            delete
        </span>
    );
}
