import { useTheme } from "../../context/ThemeContext";

export default function ComposeFooter({
    onSend,
    draftMail,
    onDelete,
    loading,
}) {
    const { darkTheme } = useTheme();
    return (
        <div className="d-flex justify-content-between align-items-center px-3 py-2 border-top">
            <button
                type="button"
                className="btn btn-sm d-flex align-items-center gap-2 px-3 py-1 fw-semibold"
                style={{
                    backgroundColor: "#0b57d0",
                    color: "white",
                    borderRadius: "20px",
                    fontSize: "14px",
                }}
                onClick={onSend}
                disabled={loading}
            >
                <span
                    className={`material-symbols-rounded ${
                        darkTheme ? "text-white" : ""
                    }`}
                    style={{ fontSize: 18 }}
                >
                    send
                </span>
                {loading ? "Sending..." : "Send"}
            </button>
            {draftMail ? (
                <button
                    type="button"
                    className="btn btn-sm d-flex align-items-center gap-2 px-3 py-1 fw-semibold"
                    style={{
                        backgroundColor: "#dc3545",
                        color: "white",
                        borderRadius: "20px",
                        fontSize: "14px",
                    }}
                    onClick={onDelete}
                    disabled={loading}
                >
                    <span className="material-symbols-rounded" style={{ fontSize: 18 }}>
                        delete
                    </span>
                    Delete
                </button>
            ) : null}
        </div>
    );
}
