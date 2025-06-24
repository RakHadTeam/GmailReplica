import { useTheme } from "../../context/ThemeContext";

export default function LabelManagerHeader({ onClose }) {
    const { darkTheme } = useTheme();
    return (
        <div
            className={`d-flex justify-content-between align-items-center mb-3 ${
                darkTheme ? "text-white" : "text-dark"
            }`}
        >
            <h5 className="m-0">Manage Labels</h5>
            <button
                className={`btn-close ${darkTheme ? "btn-close-white" : ""}`}
                aria-label="Close"
                onClick={onClose}
            ></button>
        </div>
    );
}
