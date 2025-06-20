import { useTheme } from "../context/ThemeContext";
import useLabels from "../hooks/useLabels.js";
import useMailHandlers from "../hooks/useMailHandlers.js";
import useMails from "../hooks/useMails.js";
import useStarHandlers from "../hooks/useStarHandlers.js";
import useUIs from "../hooks/useUIs.js";
import LabelPopup from "./LabelPopup.jsx";
import SearchBar from "./SearchBar.jsx";

export default function InboxHeader() {
    const {
        filteredMails,
        selectedMails,
        setSelectedMails,
        fetchMails,
        setFilteredMails,
        mails,
    } = useMails();
    const { handleDeleteBulk, handleSelectAll, handleSelect } =
        useMailHandlers();
    const { fetchLabels, starredIds } = useLabels();
    const { showLabelPopup, setShowLabelPopup, openMailId, setOpenMailId } =
        useUIs();

    const { handleToggleStarBulk } = useStarHandlers();

    const { darkTheme } = useTheme();

    const closeLabelPopup = () => {
        setShowLabelPopup(false);
    };

    return (
        <>
            <SearchBar />
            <div
                className={`d-flex justify-content-between align-items-center mb-0 ${
                    darkTheme ? "text-white" : ""
                }`}
                style={{
                    marginTop: "1rem",
                    height: "3rem",
                }}
            >
                <div
                    className="d-flex align-items-center"
                    style={{ marginLeft: "0.8rem" }}
                >
                    {openMailId ? (
                        <span
                            className="material-symbols-rounded icon-button me-3"
                            style={{ cursor: "pointer" }}
                            onClick={() => setOpenMailId(null)}
                        >
                            arrow_back
                        </span>
                    ) : (
                        <>
                            <span
                                className="material-symbols-rounded icon-button me-3"
                                style={{ cursor: "pointer" }}
                                onClick={() => {
                                    if (
                                        selectedMails.length ===
                                        filteredMails.length
                                    ) {
                                        handleSelectAll();
                                    } else if (selectedMails.length > 0) {
                                        setSelectedMails([]);
                                    } else {
                                        filteredMails.forEach((mail) =>
                                            handleSelect(mail.id)
                                        );
                                    }
                                }}
                            >
                                {selectedMails.length > 0
                                    ? selectedMails.length ===
                                      filteredMails.length
                                        ? "check_box"
                                        : "indeterminate_check_box"
                                    : "check_box_outline_blank"}
                            </span>
                            <span
                                className="material-symbols-rounded icon-button me-3"
                                style={{ cursor: "pointer" }}
                                onClick={() => {
                                    fetchMails();
                                    fetchLabels();
                                }}
                            >
                                refresh
                            </span>
                        </>
                    )}
                    {(selectedMails.length > 0 || openMailId) && (
                        <>
                            <span
                                className="material-symbols-rounded icon-button me-3"
                                style={{ cursor: "pointer" }}
                            >
                                report
                            </span>
                            <span
                                className="material-symbols-rounded icon-button me-3"
                                style={{ cursor: "pointer" }}
                            >
                                archive
                            </span>
                            <span
                                className={`icon-button me-3 fs-5 ${
                                    selectedMails.length > 0 &&
                                    selectedMails.every((id) =>
                                        starredIds.includes(id)
                                    )
                                        ? "text-warning"
                                        : ""
                                }`}
                                style={{ cursor: "pointer" }}
                                onClick={() => handleToggleStarBulk()}
                            >
                                {selectedMails.length > 0 &&
                                selectedMails.every((id) =>
                                    starredIds.includes(id)
                                )
                                    ? "★"
                                    : "☆"}
                            </span>
                            <span
                                className="material-symbols-rounded icon-button me-3"
                                style={{ cursor: "pointer" }}
                                onClick={() => setShowLabelPopup(true)}
                            >
                                label
                            </span>
                            <span
                                className="material-symbols-rounded icon-button me-3 text-danger"
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
                        {openMailId ? 1 : filteredMails.length} of 50
                    </small>
                    <span
                        className="material-symbols-rounded icon-button me-2"
                        style={{ cursor: "pointer" }}
                    >
                        chevron_left
                    </span>
                    <span
                        className="material-symbols-rounded icon-button me-2"
                        style={{ cursor: "pointer" }}
                    >
                        chevron_right
                    </span>
                </div>
            </div>
            {showLabelPopup && (
                <div className="position-absolute">
                    <LabelPopup
                        closeLabelPopup={closeLabelPopup}
                        position={{ x: 200, y: -25 }}
                    />
                </div>
            )}
        </>
    );
}
