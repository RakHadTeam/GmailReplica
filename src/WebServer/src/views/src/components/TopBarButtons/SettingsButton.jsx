import { useTheme } from "../../context/ThemeContext.js";

export default function SettingsButton({ onClick }) {
    const { darkTheme } = useTheme();
    return (
        <button
            onClick={onClick}
            className={`btn btn-sm rounded-circle d-flex align-items-center justify-content-center ${darkTheme ? "btn-primary" : "btn-outline-secondary"}`}
            style={{
                width: "40px",
                height: "40px",
                border: darkTheme ? "1px solid #444" : undefined,
            }}
        >
            <span className="material-symbols-rounded">settings</span>
        </button>
    );
}
