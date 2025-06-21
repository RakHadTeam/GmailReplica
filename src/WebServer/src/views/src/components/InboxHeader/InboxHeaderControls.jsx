import {useTheme} from "../../context/ThemeContext";
import { useMailApp } from "../../context/MailAppContext";
import ArchiveButton from "./Buttons/ArchiveButton";
import BackButton from "./Buttons/BackButton";
import DeleteButton from "./Buttons/DeleteButton";
import LabelButton from "./Buttons/LabelButton";
import RefreshButton from "./Buttons/RefreshButton";
import SelectAllButton from "./Buttons/SelectAllButton.jsx";
import SpamButton from "./Buttons/SpamButton";
import StarToggleButton from "./Buttons/StarToggleButton";

export default function InboxHeaderControls({ openMail, closeMail, toggleLabelPopup }) {
    const { darkTheme } = useTheme();
    const {
        uiState: { selectedIds },
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
                        <ArchiveButton />
                        <StarToggleButton />
                        <LabelButton toggleLabelPopup={toggleLabelPopup} />
                        <DeleteButton />
                    </>
                )}
            </div>
        </div>
    );
}
