import { useState } from "react";
import { useTheme } from "../context/ThemeContext";
import useMailHandlers from "../hooks/useMailHandlers.js";
import useMails from "../hooks/useMails.js";
import useUiState from "../hooks/useUIStates.js";
import ComposeMail from "./ComposeMail.jsx";
import LabelPopup from "./LabelPopup";
import SettingsPanel from "./SettingsPanel.jsx";

export default function InboxHeader() {
    const { filteredMails, selectedMails } = useMails();
    const { handleDeleteBulk, handleSelectAll } = useMailHandlers();
    const {
        settingsOpen,
        toggleSettings,
        handleToggleStarBulk,
        showLabelPopup,
        setShowLabelPopup,
        showCompose,
        toggleShowCompose,
    } = useUiState();

    const { darkTheme } = useTheme();
    const [labelPopupPosition, setLabelPopupPosition] = useState({
        x: 0,
        y: 0,
    });

    return (
        <>
            <div
                className={`d-flex justify-content-between align-items-center mt-3 ${
                    darkTheme ? "text-white" : ""
                }`}
            >
                <div className="d-flex align-items-center">
                    <span
                        className="material-symbols-rounded me-3"
                        style={{ cursor: "pointer" }}
                        onClick={handleSelectAll}
                    >
                        {selectedMails.length > 0
                            ? selectedMails.length === filteredMails.length
                                ? "check_box"
                                : "indeterminate_check_box"
                            : "check_box_outline_blank"}
                    </span>
                    <span
                        className="material-symbols-rounded me-3"
                        style={{ cursor: "pointer" }}
                    >
                        refresh
                    </span>
                    {selectedMails.length > 0 && (
                        <>
                            <span
                                className="material-symbols-rounded me-3"
                                style={{ cursor: "pointer" }}
                            >
                                report
                            </span>
                            <span
                                className="material-symbols-rounded me-3"
                                style={{ cursor: "pointer" }}
                            >
                                archive
                            </span>
                            <span
                                className="material-symbols-rounded me-3"
                                style={{ cursor: "pointer" }}
                                onClick={handleToggleStarBulk}
                            >
                                star
                            </span>
                            <span
                                className="material-symbols-rounded me-3"
                                style={{ cursor: "pointer" }}
                                onClick={(e) => {
                                    const rect =
                                        e.target.getBoundingClientRect();
                                    setLabelPopupPosition({
                                        x: rect.left,
                                        y: rect.bottom,
                                    });
                                    setShowLabelPopup(true);
                                }}
                            >
                                label
                            </span>
                            <span
                                className="material-symbols-rounded me-3 text-danger"
                                style={{ cursor: "pointer" }}
                                onClick={handleDeleteBulk}
                            >
                                delete
                            </span>
                        </>
                    )}
                </div>
                <div className="ms-auto d-flex align-items-center">
                    <small
                        className={`me-3 ${
                            darkTheme ? "text-light" : "text-muted"
                        }`}
                    >
                        1–50 of {filteredMails.length}
                    </small>
                    <span
                        className="material-symbols-rounded me-2"
                        style={{ cursor: "pointer" }}
                    >
                        chevron_left
                    </span>
                    <span
                        className="material-symbols-rounded me-2"
                        style={{ cursor: "pointer" }}
                    >
                        chevron_right
                    </span>
                    <span
                        className="material-symbols-rounded me-2"
                        style={{ cursor: "pointer" }}
                        onClick={toggleSettings}
                    >
                        settings
                    </span>
                    <button
                        className={`btn btn-sm ${
                            darkTheme ? "btn-primary" : "btn-outline-primary"
                        } ms-3`}
                        onClick={toggleShowCompose}
                    >
                        <span className="material-symbols-rounded me-1">
                            edit
                        </span>
                        Compose
                    </button>
                </div>
            </div>
            {showLabelPopup && (
                <div className="position-absolute">
                    <LabelPopup position={{ x: 220, y: 0 }} />
                </div>
            )}
            {showCompose && <ComposeMail />}
            {settingsOpen && <SettingsPanel />}
        </>
    );
}
