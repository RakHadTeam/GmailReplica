import { useTheme } from "../../../context/ThemeContext";

export default function ArchiveButton() {
    const { darkTheme } = useTheme();

    return (
        <span
            className={`material-symbols-rounded icon-button me-3 ${
                darkTheme ? "text-white" : ""
            }`}
            style={{ cursor: "pointer" }}
            title="Archive"
        >
            archive
        </span>
    );
}
