import { useEffect } from "react";
import ContextMenu from "../components/ContextMenu";
import InboxHeader from "../components/InboxHeader";
import LabelManager from "../components/LabelManager";
import MailDetail from "../components/MailDetail";
import MailFilter from "../components/MailFilter";
import MailList from "../components/MailsList";
import SettingsPanel from "../components/SettingsPanel";
import { useTheme } from "../context/ThemeContext";
import useLabelHandlers from "../hooks/useLabelHandlers";
import useLabels from "../hooks/useLabels.js";
import useMailHandlers from "../hooks/useMailHandlers";
import useMailState from "../hooks/useMails.js";
import useStarHandlers from "../hooks/useStarHandlers";
import useUIState from "../hooks/useUIStates.js";

export function Inbox() {
    const { mails, fetchMails } = useMailState();
    const { labels, setLabels, starredIds, setStarredIds, fetchLabels } = useLabels();
    const {
        contextMenu,
        setContextMenu,
        showLabelMenu,
        setShowLabelMenu,
        selectedMails,
        setSelectedMails,
        activeLabel,
        setActiveLabel,
        openMailId,
        setOpenMailId,
        settingsOpen,
        toggleSettings,
        labelsOpen,
        toggleLabels,
        toggleLabelManager,
        labelManagerOpen,
        menuRef,
    } = useUIState();
    const { darkTheme } = useTheme();

    useEffect(() => {
        fetchMails();
        fetchLabels();
        const mid = setInterval(fetchMails, 15000);
        return () => clearInterval(mid);
    }, []);

    const {
        handleOpenMail,
        handleCloseDetail,
        handleSelect,
        handleSelectAll,
        handleDelete,
        handleDeleteBulk,
    } = useMailHandlers({
        mails,
        selectedMails,
        setOpenMailId,
        setSelectedMails,
        fetchMails,
        setContextMenu,
    });

    const { handleToggleStar, handleToggleStarBulk } = useStarHandlers({
        setStarredIds,
        fetchMails,
        setContextMenu,
        selectedMails,
    });

    const { handleLabelToggle } = useLabelHandlers({
        selectedMails,
        contextMenu,
        fetchMails,
        setShowLabelMenu,
        setContextMenu,
    });

    const filteredMails = mails.filter((mail) => {
        if (activeLabel === "All") return true;
        if (activeLabel === "Starred") return starredIds.includes(mail.id);
        const lbl = labels.find((l) => l.id === activeLabel);
        return Array.isArray(lbl?.mails) && lbl.mails.includes(mail.id);
    });

    const openMail = mails.find((m) => m.id === openMailId);

    return (
        <div
            className={`min-vh-100 w-100 ${
                darkTheme ? "bg-black text-white" : "bg-light text-dark"
            }`}
        >
            <div className="container py-4">
                <InboxHeader
                    toggleSettings={toggleSettings}
                    toggleLabels={toggleLabels}
                    toggleLabelManager={toggleLabelManager}
                    handleSelectAll={() => handleSelectAll(filteredMails)}
                    selectedMails={selectedMails}
                    filteredMails={filteredMails}
                    handleDeleteBulk={handleDeleteBulk}
                    handleToggleStarBulk={handleToggleStarBulk}
                    handleLabelToggle={handleLabelToggle}
                    onLabelsChange={setLabels}
                />

                <MailFilter
                    activeLabel={activeLabel}
                    setActiveLabel={setActiveLabel}
                />

                <MailList
                    mails={filteredMails}
                    selectedMails={selectedMails}
                    handleSelect={handleSelect}
                    handleRightClick={(e, mailId) => {
                        e.preventDefault();
                        setContextMenu({ x: e.pageX, y: e.pageY, mailId });
                        setShowLabelMenu(false);
                    }}
                    handleOpenMail={handleOpenMail}
                    handleToggleStar={handleToggleStar}
                    starredIds={starredIds}
                />

                <MailDetail
                    openMail={openMail}
                    handleCloseDetail={handleCloseDetail}
                />

                <ContextMenu
                    contextMenu={contextMenu}
                    menuRef={menuRef}
                    handleDelete={handleDelete}
                    handleToggleStar={handleToggleStar}
                    selectedMails={selectedMails}
                    handleLabelToggle={handleLabelToggle}
                    showLabelMenu={showLabelMenu}
                    setShowLabelMenu={setShowLabelMenu}
                />

                {settingsOpen && <SettingsPanel onClose={toggleSettings} />}

                {labelManagerOpen && (
                    <LabelManager
                        onLabelsChange={setLabels}
                        onClose={toggleLabelManager}
                    />
                )}
            </div>
        </div>
    );
}
