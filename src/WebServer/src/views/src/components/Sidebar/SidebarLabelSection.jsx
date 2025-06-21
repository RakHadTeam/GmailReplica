import { useMailApp } from "../../context/MailAppContext.js";
import { useTheme } from "../../context/ThemeContext.js";

export default function SidebarLabelSection({ onSelectLabel, onManageLabels }) {
    const { darkTheme } = useTheme();
    const {
        labelState: { labels },
        uiState: { activeLabel },
    } = useMailApp();
    const systemLabels = new Set(["Starred", "Spam", "Bin", "Sent"]);

    return (
        <div className="mt-2 d-flex flex-column gap-2">
            <div className="d-flex justify-content-between align-items-center mb-2">
                <span
                    className={`fs-5 fw-bold ${
                        darkTheme ? "text-light" : "text-dark"
                    }`}
                >
                    Labels
                </span>
                <button
                    className="btn btn-sm rounded-circle d-flex align-items-center justify-content-center"
                    style={{ width: "32px", height: "32px" }}
                    onClick={onManageLabels}
                >
                    <span className="material-symbols-rounded">settings</span>
                </button>
            </div>

            {labels
                .filter((label) => !systemLabels.has(label.id))
                .map((label) => (
                    <button
                        key={label.id}
                        className={`btn d-flex align-items-center gap-2 text-start ${
                            label.id === activeLabel ? "active" : ""
                        } ${darkTheme ? "text-light" : "text-dark"}`}
                        onClick={() => onSelectLabel(label.id)}
                    >
                        <span className="material-symbols-rounded">label</span>
                        {label.name}
                    </button>
                ))}
        </div>
    );
}
