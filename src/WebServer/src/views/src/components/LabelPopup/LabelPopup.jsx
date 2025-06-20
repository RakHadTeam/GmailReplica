import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext";
import useLabelHandlers from "../../hooks/useLabelHandlers.js";
import useLabels from "../../hooks/useLabels.js";
import useMails from "../../hooks/useMails.js";
import useUIs from "../../hooks/useUIs.js";
import LabelPopupCreatePrompt from "./LabelPopupCreatePrompt.jsx";
import LabelPopupFooter from "./LabelPopupFooter.jsx";
import LabelPopupHeader from "./LabelPopupHeader.jsx";
import LabelPopupList from "./LabelPopupList.jsx";
import LabelPopupSearch from "./LabelPopupSearch.jsx";

export default function LabelPopup({ closeLabelPopup, position }) {
    const { labels, fetchLabels } = useLabels();
    const { handleLabelToggleOnMailId } = useLabelHandlers();
    const { toggleLabelManager } = useUIs();
    const { selectedMails } = useMails();
    const { darkTheme } = useTheme();

    const [newLabel, setNewLabel] = useState("");
    const [error, setError] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [showCreatePrompt, setShowCreatePrompt] = useState(false);
    const navigate = useNavigate();
    const popupRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (popupRef.current && !popupRef.current.contains(event.target)) {
                closeLabelPopup();
            }
        };

        const delayedClickHandler = (event) => {
            setTimeout(() => handleClickOutside(event), 0);
        };

        document.addEventListener("mousedown", delayedClickHandler);
        return () => {
            document.removeEventListener("mousedown", delayedClickHandler);
        };
    }, []);

    const createLabel = async () => {
        const name = newLabel.trim();
        if (!name) return;

        try {
            const res = await fetch("/api/labels", {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name }),
            });
            if (res.status === 401) {
                navigate("/signin");
                return;
            }
            if (!res.ok) throw new Error(`Create failed: ${res.status}`);

            await fetchLabels();
            setNewLabel("");
            setSearchTerm("");
            setShowCreatePrompt(false);
        } catch (err) {
            console.error(err);
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
                <LabelPopupHeader onClose={closeLabelPopup} />
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
                    handleLabelToggleOnMailId={handleLabelToggleOnMailId}
                />
                <LabelPopupFooter
                    onCreateClick={() => setShowCreatePrompt(true)}
                    onManageClick={toggleLabelManager}
                />
            </div>
            {showCreatePrompt && (
                <LabelPopupCreatePrompt
                    newLabel={newLabel}
                    setNewLabel={setNewLabel}
                    onCancel={() => setShowCreatePrompt(false)}
                    onCreate={createLabel}
                    error={error}
                />
            )}
        </div>
    );
}
