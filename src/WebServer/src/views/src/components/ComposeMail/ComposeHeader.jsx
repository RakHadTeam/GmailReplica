import { useTheme } from "../../context/ThemeContext";

export default function ComposeHeader({ draftMail, handleCloseClick }) {
    const { darkTheme } = useTheme();
    return (
        <div className="d-flex justify-content-between align-items-center px-3 py-2 border-bottom">
            <div className="fw-semibold">
                {draftMail ? "Edit Draft" : "New Message"}
            </div>
            <button className="btn btn-sm btn-icon" onClick={handleCloseClick}>
                <span
                    className={`material-symbols-rounded ${
                        darkTheme ? "text-white" : ""
                    }`}
                >
                    close
                </span>
            </button>
        </div>
    );
}
