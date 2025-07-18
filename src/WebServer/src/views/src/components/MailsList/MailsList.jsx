import { useEffect, useState } from "react";
import { useMailApp } from "../../context/MailAppContext.js";
import { useTheme } from "../../context/ThemeContext.js";
import { useStarActions } from "../../hooks/useStarActions.js";
import ContextMenu from "../ContextMenu/ContextMenu.jsx";
import MailsListRow from "./MailsListRow.jsx";

export default function MailList({ searchQuery, openMail, setOpenMail }) {
    const {
        uiState: { selectedIds, setSelectedIds },
        mailState: { mails },
        filteredMails,
    } = useMailApp();

    const { toggleStar } = useStarActions();

    const [contextMenu, setContextMenu] = useState(null);

    const handleSelect = (mailId) => {
        setSelectedIds((prev) =>
            prev.includes(mailId)
                ? prev.filter((id) => id !== mailId)
                : [...prev, mailId]
        );
    };

    const handleOpenMail = (id) => {
        setContextMenu(null);
        setOpenMail(mails.find((m) => m.id === id) || null);
    };

    const toggleContextMenu = () => {
        setContextMenu(null);
    };

    const { darkTheme } = useTheme();

    const searchResults = mails.filter(
        (m) =>
            m.subject?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            m.body?.toLowerCase().includes(searchQuery.toLowerCase())
    );
    const listToShow =
        searchQuery.trim() !== "" ? searchResults : filteredMails || [];

    useEffect(() => {
        if (openMail && !mails.find((m) => m.id === openMail.id)) {
            setOpenMail(null);
        }
    }, [mails, openMail, setOpenMail]);

    const handleRightClick = (e, mailId) => {
        e.preventDefault();
        setContextMenu({ x: e.clientX, y: e.clientY, mailId });
        if (!selectedIds.includes(mailId)) {
            setSelectedIds([]);
            handleSelect(mailId);
        }
    };

    return (
        <div className="w-100 position-relative mt-2">
            {contextMenu && (
                <ContextMenu
                    contextMenu={contextMenu}
                    onClose={toggleContextMenu}
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
                        isSelected={selectedIds.includes(mail.id)}
                        onSelect={handleSelect}
                        onClick={handleOpenMail}
                        onRightClick={handleRightClick}
                        onToggleStar={toggleStar}
                    />
                ))}
            </div>
        </div>
    );
}
