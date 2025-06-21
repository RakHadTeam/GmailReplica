import { useEffect, useRef, useState } from "react";
import { useMailApp } from "../../context/MailAppContext.js";
import { useTheme } from "../../context/ThemeContext";
import { useLabelActions } from "../../hooks/useLabelActions.js";
import LabelPopupCreatePrompt from "./LabelPopupCreatePrompt.jsx";
import LabelPopupFooter from "./LabelPopupFooter.jsx";
import LabelPopupHeader from "./LabelPopupHeader.jsx";
import LabelPopupList from "./LabelPopupList.jsx";
import LabelPopupSearch from "./LabelPopupSearch.jsx";

export default function LabelPopup({ onClose, position, onManageClick }) {
    const {
        labelState: { labels },
        uiState: { selectedIds: selectedMails },
    } = useMailApp();

    const { darkTheme } = useTheme();
    const { createLabel } = useLabelActions();

    const [newLabel, setNewLabel] = useState("");
    const [error, setError] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [showCreatePrompt, setShowCreatePrompt] = useState(false);
    const popupRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (popupRef.current && !popupRef.current.contains(event.target)) {
                onClose();
            }
        };

        const delayedClickHandler = (event) => {
            setTimeout(() => handleClickOutside(event), 0);
        };

        document.addEventListener("mousedown", delayedClickHandler);
        return () => {
            document.removeEventListener("mousedown", delayedClickHandler);
        };
    }, [onClose]);

    const handleCreateLabel = async () => {
        const name = newLabel.trim();
        if (!name) return;

        try {
            await createLabel(name);
            setNewLabel("");
            setShowCreatePrompt(false);
        } catch (err) {
            setError("Could not create label");
        }
    };

    return (
        <div
            ref={popupRef}
            className="position-absolute"
            style={{
                top: position.y,
                left: position.x,
                zIndex: 100,
            }}
        >
            <div
                className={`rounded shadow border overflow-hidden ${
                    darkTheme ? "bg-dark text-white" : "bg-white text-dark"
                }`}
                style={{ width: "320px" }}
            >
                <LabelPopupHeader onClose={onClose} />
                {error && (
                    <div className="alert alert-danger py-1 mb-3 mx-3">
                        {error}
                    </div>
                )}
                <LabelPopupSearch
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                />
                <LabelPopupList
                    searchTerm={searchTerm}
                    selectedMails={selectedMails}
                    labels={labels}
                />
                <LabelPopupFooter
                    onCreateClick={() => setShowCreatePrompt(true)}
                    onManageClick={onManageClick}
                />
            </div>
            {showCreatePrompt && (
                <LabelPopupCreatePrompt
                    newLabel={newLabel}
                    setNewLabel={setNewLabel}
                    onCancel={() => setShowCreatePrompt(false)}
                    onCreate={handleCreateLabel}
                    error={error}
                />
            )}
        </div>
    );
}
