import { useTheme } from "../../context/ThemeContext";

export default function ComposeHeader({ draftMail, onClose }) {
    const { darkTheme } = useTheme();

    return (
        <div className="d-flex justify-content-between align-items-center px-3 py-2 border-bottom">
            <div className="fw-semibold">
                {draftMail ? "Edit Draft" : "New Message"}
            </div>
            
            <div className="d-flex">
                <button
                    className={`btn btn-sm ${
                        darkTheme ? "btn-light" : "btn-outline-secondary"
                    }`}
                    onClick={onClose}
                >
                    {draftMail ? "Save Draft" : "Save as Draft"}
                </button>
            </div>
        </div>
    );
}
