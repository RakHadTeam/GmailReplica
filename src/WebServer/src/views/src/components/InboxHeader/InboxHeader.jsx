import { useState } from "react";
import SearchBar from "../SearchBar/SearchBar";
import InboxHeaderControls from "./InboxHeaderControls";
import LabelPopupWrapper from "./LabelPopupWrapper";
import { useMailApp } from "../../context/MailAppContext.js";

export default function InboxHeader({
    searchQuery,
    setSearchQuery,
    openMail,
    setOpenMail,
}) {
    const [showLabelPopup, setShowLabelPopup] = useState(false);

    const { uiState: { setSelectedIds } } = useMailApp();

    const toggleLabelPopup = () => {
        setShowLabelPopup((prev) => !prev);
    };

    const closeMail = () => {
        setOpenMail(null);
        setSelectedIds([]);
    };

    return (
        <>
            <SearchBar
                openMail={openMail}
                setOpenMail={setOpenMail}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
            />
            <InboxHeaderControls
                toggleLabelPopup={toggleLabelPopup}
                openMail={openMail}
                closeMail={closeMail}
            />
            {showLabelPopup && (
                <LabelPopupWrapper toggleLabelPopup={toggleLabelPopup} />
            )}
        </>
    );
}
