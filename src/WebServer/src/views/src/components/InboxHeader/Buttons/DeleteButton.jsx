import useMailHandlers from "../../../hooks/useMailHandlers";

export default function DeleteButton() {
    const { handleDeleteBulk } = useMailHandlers();

    return (
        <span
            className="material-symbols-rounded icon-button me-3 text-danger"
            style={{ cursor: "pointer" }}
            onClick={() => handleDeleteBulk()}
        >
            delete
        </span>
    );
}
