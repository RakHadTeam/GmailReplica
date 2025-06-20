import {useTheme} from "../../context/ThemeContext";
import useMails from "../../hooks/useMails";
import useUIs from "../../hooks/useUIs";
import ArchiveButton from "./Buttons/ArchiveButton";
import BackButton from "./Buttons/BackButton";
import DeleteButton from "./Buttons/DeleteButton";
import LabelButton from "./Buttons/LabelButton";
import RefreshButton from "./Buttons/RefreshButton";
import SelectAllButton from "./Buttons/SelectAllButton.jsx";
import SpamButton from "./Buttons/SpamButton";
import StarToggleButton from "./Buttons/StarToggleButton";

export default function InboxHeaderControls() {
    const { selectedMails, filteredMails } = useMails();
    const { darkTheme } = useTheme();
    const { openMailId } = useUIs();

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
                {openMailId ? (
                    <BackButton />
                ) : (
                    <>
                        <SelectAllButton />
                        <RefreshButton />
                    </>
                )}

                {(selectedMails.length > 0 || openMailId) && (
                    <>
                        <SpamButton />
                        <ArchiveButton />
                        <StarToggleButton />
                        <LabelButton />
                        <DeleteButton />
                    </>
                )}
            </div>
        </div>
    );
}
