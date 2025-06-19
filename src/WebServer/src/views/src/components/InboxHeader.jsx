import { useTheme } from "../context/ThemeContext";
import useLabels from "../hooks/useLabels.js";
import useMailHandlers from "../hooks/useMailHandlers.js";
import useMails from "../hooks/useMails.js";
import useStarHandlers from "../hooks/useStarHandlers.js";
import useUIs from "../hooks/useUIs.js";
import LabelPopup from "./LabelPopup";
import SettingsPanel from "./SettingsPanel.jsx";

export default function InboxHeader() {
    const { filteredMails, selectedMails, setSelectedMails, fetchMails } =
        useMails();
    const { handleDeleteBulk, handleSelectAll, handleSelect } =
        useMailHandlers();
    const { fetchLabels } = useLabels();
    const {
        showLabelPopup,
        setShowLabelPopup,
    } = useUIs();

    const { handleToggleStarBulk } = useStarHandlers();

    const { darkTheme } = useTheme();

    const closeLabelPopup = () => {
        setShowLabelPopup(false);
    };

    return (
        <>
            <div
                className={`d-flex justify-content-between align-items-center mb-4 ${
                    darkTheme ? "text-white" : ""
                }`}
                style={{
                    marginTop: "5rem",
                }}
            >
                <div className="d-flex align-items-center">
                    <span
                        className="material-symbols-rounded me-3"
                        style={{ cursor: "pointer" }}
                        onClick={() => {
                            if (selectedMails.length === filteredMails.length) {
                                handleSelectAll(); // deselect all
                            }
                            if (selectedMails.length > 0) {
                                setSelectedMails([]); // clear selection
                            } else {
                                filteredMails.forEach((mail) =>
                                    handleSelect(mail.id)
                                ); // select all
                            }
                        }}
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
                        onClick={() => {
                            fetchMails();
                            fetchLabels();
                        }}
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
                                onClick={() => handleToggleStarBulk()}
                            >
                                star
                            </span>
                            <span
                                className="material-symbols-rounded me-3"
                                style={{ cursor: "pointer" }}
                                onClick={() => setShowLabelPopup(true)}
                            >
                                label
                            </span>
                            <span
                                className="material-symbols-rounded me-3 text-danger"
                                style={{ cursor: "pointer" }}
                                onClick={() => handleDeleteBulk()}
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
                </div>
            </div>
            {showLabelPopup && (
                <div className="position-absolute">
                    <LabelPopup
                        position={{ x: 200, y: -10 }}
                        closeLabelPopup={closeLabelPopup}
                    />
                </div>
            )}
        </>
    );
}
