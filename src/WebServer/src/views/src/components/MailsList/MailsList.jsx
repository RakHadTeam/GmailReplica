import { useEffect, useState } from "react";
import { useTheme } from "../../context/ThemeContext.jsx";
import useLabels from "../../hooks/useLabels.js";
import useMailHandlers from "../../hooks/useMailHandlers.js";
import useMails from "../../hooks/useMails.js";
import useStarHandlers from "../../hooks/useStarHandlers.js";
import useUIs from "../../hooks/useUIs.js";
import ComposeMail from "../ComposeMail/ComposeMail.jsx";
import MailDetail from "../MailDetail/MailDetail.jsx";
import MailsListRow from "./MailsListRow.jsx";

export default function MailList() {
    const { setShowLabelPopup, setContextMenu, openMailId } = useUIs();
    const { starredIds, activeLabel } = useLabels();
    const { handleSelect, handleOpenMail, handleCloseDetail } =
        useMailHandlers();
    const { handleToggleStar } = useStarHandlers();
    const {
        mails,
        filteredMails,
        selectedMails,
        setSelectedMails,
        searchQuery,
        searchResults,
    } = useMails();
    const { darkTheme } = useTheme();

    const [openMail, setOpenMail] = useState(null);
    const listToShow = searchQuery.trim() ? searchResults : filteredMails;

    useEffect(() => {
        if (openMailId != null) {
            setOpenMail(mails.find((m) => m.id === openMailId) || null);
        } else {
            setOpenMail(null);
        }
    }, [openMailId, mails]);

    const handleRightClick = (e, mailId) => {
        e.preventDefault();
        setContextMenu({ x: e.pageX, y: e.pageY, mailId });
        if (!selectedMails.includes(mailId)) {
            setSelectedMails([]);
            handleSelect(mailId);
        }
        setShowLabelPopup(false);
    };

    if (openMail && !openMail.draft) {
        return <MailDetail handleCloseDetail={handleCloseDetail} />;
    }

    return (
        <div className="w-100 position-relative mt-2">
            {openMail && openMail.draft && (
                <ComposeMail
                    draftMail={openMail}
                    handleCloseCompose={handleCloseDetail}
                />
            )}

            <div
                className={`table w-100 ${
                    darkTheme ? "bg-dark text-white" : "bg-white text-dark"
                }`}
            >
                {listToShow.map((mail) => (
                    <MailsListRow
                        key={mail.id}
                        mail={mail}
                        isSelected={selectedMails.includes(mail.id)}
                        onSelect={handleSelect}
                        onClick={handleOpenMail}
                        onRightClick={handleRightClick}
                        onToggleStar={handleToggleStar}
                        starred={starredIds.includes(mail.id)}
                        activeLabel={activeLabel}
                        darkTheme={darkTheme}
                    />
                ))}
            </div>
        </div>
    );
}
