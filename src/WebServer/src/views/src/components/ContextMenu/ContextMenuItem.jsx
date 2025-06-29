import { useTheme } from "../../context/ThemeContext.js";

export default function ContextMenuItem({ icon, label, onClick }) {
    const { darkTheme } = useTheme();
    return (
        <button
            className={`btn w-100 text-start d-flex align-items-center gap-2 ${
                darkTheme ? "btn-dark text-light" : "btn-light text-dark"
            }`}
            onClick={onClick}
        >
            <span className="material-symbols-rounded">{icon}</span>
            {label}
        </button>
    );
}
