import { useMailApp } from "../../context/MailAppContext.js";
import { useTheme } from "../../context/ThemeContext.js";
import BackButton from "./Buttons/BackButton.jsx";
import DeleteButton from "./Buttons/DeleteButton.jsx";
import LabelButton from "./Buttons/LabelButton.jsx";
import RefreshButton from "./Buttons/RefreshButton.jsx";
import SelectAllButton from "./Buttons/SelectAllButton.jsx";
import SpamButton from "./Buttons/SpamButton.jsx";
import StarToggleButton from "./Buttons/StarToggleButton.jsx";
import UnBinButton from "./Buttons/UnBinButton.jsx";

export default function InboxHeaderControls({
    openMail,
    closeMail,
    toggleLabelPopup,
}) {
    const { darkTheme } = useTheme();
    const {
        uiState: { selectedIds, activeLabel },
    } = useMailApp();

    return (
        <div
            className={`d-flex justify-content-between align-items-center mb-0 ${
                darkTheme ? "text-white" : ""
            }`}
            style={{ marginTop: "1rem", height: "3rem" }}
        >
            <div
                className="d-flex align-items-center"
                style={{ marginLeft: "0.8rem" }}
            >
                {openMail ? (
                    <BackButton onClose={closeMail} />
                ) : (
                    <>
                        <SelectAllButton />
                        <RefreshButton />
                    </>
                )}

                {(selectedIds.length > 0 || openMail) && (
                    <>
                        <SpamButton />
                        <StarToggleButton />
                        <LabelButton onClick={toggleLabelPopup} />
                        <DeleteButton />
                        {activeLabel === "Bin" && <UnBinButton />}
                    </>
                )}
            </div>
        </div>
    );
}
