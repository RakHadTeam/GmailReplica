import { useEffect, useMemo, useState } from "react";
import ComposeMail from "../components/ComposeMail/ComposeMail.jsx";
import InboxHeader from "../components/InboxHeader/InboxHeader.jsx";
import LabelManager from "../components/LabelManager/LabelManager.jsx";
import MailDetail from "../components/MailDetail/MailDetail.jsx";
import MailList from "../components/MailsList/MailsList.jsx";
import Sidebar from "../components/Sidebar/Sidebar.jsx";
import { useMailApp } from "../context/MailAppContext.js";
import { useTheme } from "../context/ThemeContext";
import { useLabelActions } from "../hooks/useLabelActions.js";
import { useMailActions } from "../hooks/useMailActions.js";

export function Inbox() {
    const { fetchMails } = useMailActions();
    const { fetchLabels } = useLabelActions();
    const {
        uiState: { selectedIds, setSelectedIds },
    } = useMailApp();
    const { darkTheme } = useTheme();

    const [labelManagerOpen, setLabelManagerOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [openMail, setOpenMail] = useState(null);

    useMemo(() => {
        setSelectedIds(openMail ? [openMail.id] : []);
    }, [openMail]);
    useMemo(() => {
        if (selectedIds.length === 0) setOpenMail(null);
    }, [selectedIds]);

    const toggleLabelManager = () => {
        setLabelManagerOpen((prev) => !prev);
    };

    const closeDraftCompose = () => {
        setOpenMail(null);
    };

    useEffect(() => {
        fetchMails();
        fetchLabels();
        const mid = setInterval(fetchMails, 15000);
        return () => clearInterval(mid);
    }, []);

    return (
        <div
            className={`min-vh-100  ${
                darkTheme ? "bg-black text-white" : "bg-light text-dark"
            }`}
        >
            <div className="d-flex">
                <div
                    style={{
                        width: "240px",
                        flexShrink: 0,
                        minHeight: "100vh",
                    }}
                    className={darkTheme ? `bg-dark` : `bg-light`}
                >
                    <Sidebar toggleLabelManager={toggleLabelManager} />
                </div>
                <div
                    className="flex-grow-1"
                    style={{ overflowY: "auto", overflowX: "hidden" }}
                >
                    <div className="py-4 px-3 w-100">
                        <InboxHeader
                            searchQuery={searchQuery}
                            setSearchQuery={setSearchQuery}
                            openMail={openMail}
                            setOpenMail={setOpenMail}
                        />
                        {openMail ? (
                            openMail.draft ? (
                                <>
                                    <ComposeMail
                                        draftMail={openMail}
                                        onClose={closeDraftCompose}
                                    />
                                    <MailList
                                        openMail={openMail}
                                        searchQuery={searchQuery}
                                        setOpenMail={setOpenMail}
                                    />
                                </>
                            ) : (
                                <MailDetail
                                    mail={openMail}
                                    closeDraftCompose={closeDraftCompose}
                                />
                            )
                        ) : (
                            <MailList
                                openMail={openMail}
                                searchQuery={searchQuery}
                                setOpenMail={setOpenMail}
                                setSearchQuery={setSearchQuery}
                            />
                        )}

                        {labelManagerOpen && (
                            <LabelManager onClose={toggleLabelManager} />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
