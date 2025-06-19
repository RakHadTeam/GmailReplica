import { useState } from "react";
import { useTheme } from "../context/ThemeContext";
import ComposeMail from "./ComposeMail.jsx";
import LabelPopup from "./LabelPopup";
import useLabels from "../hooks/useLabels.js";

export default function InboxHeader({
    toggleSettings,
    toggleLabels,
    handleSelectAll,
    selectedMails,
    filteredMails,
    handleDeleteBulk,
    handleToggleStarBulk,
    toggleLabelManager,
    handleLabelToggle,
    onLabelsChange,
}) {
    const [labelPopupPos, setLabelPopupPos] = useState(null);
    const [showCompose, setShowCompose] = useState(false);
    const { labels } = useLabels();
    const { darkTheme } = useTheme();

    const closeLabelPopup = () => setLabelPopupPos(null);

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
                                    setLabelPopupPos({
                                        x: rect.left,
                                        y: rect.bottom + window.scrollY,
                                    });
                                    toggleLabels();
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
                    <small className={`me-3 ${darkTheme ? "text-light" : "text-muted"}`}>
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
                        onClick={() => setShowCompose(true)}
                    >
                        <span className="material-symbols-rounded me-1">
                            edit
                        </span>
                        Compose
                    </button>
                </div>
            </div>
            {labelPopupPos && selectedMails.length > 0 && (
                <LabelPopup
                    labels={labels}
                    onLabelsChange={onLabelsChange}
                    position={labelPopupPos}
                    onClose={closeLabelPopup}
                    handleLabelToggle={handleLabelToggle}
                    toggleLabelManager={toggleLabelManager}
                />
            )}
            {showCompose && <ComposeMail show={showCompose} onClose={() => setShowCompose(false)} />}
        </>
    );
}
