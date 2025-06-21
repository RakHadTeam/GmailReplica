import { useTheme } from "../../context/ThemeContext.js";

export default function DarkModeButton({ onClick }) {
    const { darkTheme } = useTheme();
    return (
        <button
            onClick={onClick}
            className={`btn btn-sm rounded-circle d-flex align-items-center justify-content-center ${darkTheme ? "btn-primary" : "btn-outline-secondary"}`}
            style={{ width: "40px", height: "40px" }}
        >
            <span className="material-symbols-rounded">{darkTheme ? "light_mode" : "dark_mode"}</span>
        </button>
    );
}