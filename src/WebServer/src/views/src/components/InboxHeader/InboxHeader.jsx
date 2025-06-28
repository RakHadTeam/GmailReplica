import { useState } from "react";
import { useMailApp } from "../../context/MailAppContext.js";
import SearchBar from "../SearchBar/SearchBar.jsx";
import InboxHeaderControls from "./InboxHeaderControls.jsx";
import LabelPopupWrapper from "./LabelPopupWrapper.jsx";

export default function InboxHeader({
    searchQuery,
    setSearchQuery,
    openMail,
    setOpenMail,
    toggleLabelManager,
}) {
    const [showLabelPopup, setShowLabelPopup] = useState(false);

    const {
        uiState: { setSelectedIds },
    } = useMailApp();

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
                <LabelPopupWrapper
                    toggleLabelPopup={toggleLabelPopup}
                    toggleLabelManager={toggleLabelManager}
                />
            )}
        </>
    );
}
