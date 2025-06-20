import useUIs from "../../../hooks/useUIs";

export default function BackButton() {
    const { setOpenMailId } = useUIs();

    return (
        <span
            className="material-symbols-rounded icon-button me-3"
            style={{ cursor: "pointer" }}
            onClick={() => setOpenMailId(null)}
        >
            arrow_back
        </span>
    );
}
