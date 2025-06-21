// LabelManager.jsx
import { useEffect, useRef, useState } from "react";
import { useTheme } from "../../context/ThemeContext.js";
import LabelList from "./LabelList";
import LabelManagerHeader from "./LabelManagerHeader";
import LabelManagerInput from "./LabelManagerInput";

export default function LabelManager({ toggleLabelManager }) {
    const { darkTheme } = useTheme();
    const [searchTerm, setSearchTerm] = useState("");
    const [newLabel, setNewLabel] = useState("");
    const [error, setError] = useState("");

    const popupRef = useRef(null);

    useEffect(() => {
        function handleClickOutside(event) {
            if (popupRef.current && !popupRef.current.contains(event.target)) {
                toggleLabelManager();
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, [toggleLabelManager]);

    return (
        <div
            className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center"
            style={{
                zIndex: 1050,
                padding: "2rem",
                backgroundColor: darkTheme
                    ? "rgba(0, 0, 0, 0.6)"
                    : "rgba(0, 0, 0, 0.3)",
            }}
        >
            <div
                ref={popupRef}
                className={`p-4 rounded shadow border ${
                    darkTheme ? "bg-dark text-white" : "bg-white text-dark"
                }`}
                style={{ minWidth: "400px", maxWidth: "500px", width: "100%" }}
            >
                <LabelManagerHeader toggleLabelManager={toggleLabelManager} />
                <LabelManagerInput
                    newLabel={newLabel}
                    setNewLabel={setNewLabel}
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    setError={setError}
                />
                {error && (
                    <div className="alert alert-danger py-1">{error}</div>
                )}
                <LabelList searchTerm={searchTerm} setError={setError} />
            </div>
        </div>
    );
}
