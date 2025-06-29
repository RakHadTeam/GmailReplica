import { useTheme } from "../../context/ThemeContext";

export default function SettingsHeader({ onClose }) {
    const { darkTheme } = useTheme();

    return (
        <div
            className={`d-flex justify-content-between align-items-center mb-4 ${
                darkTheme ? "bg-dark text-light" : "text-dark"
            }`}
        >
            <div className="d-flex align-items-center gap-2">
                <span
                    className="material-symbols-rounded"
                    style={{ fontSize: "1.5rem" }}
                >
                    settings
                </span>
                <h5 className="mb-0">Settings</h5>
            </div>
            <button
                className="btn-close"
                onClick={onClose}
                style={darkTheme ? { filter: "invert(1)" } : {}}
            ></button>
        </div>
    );
}
