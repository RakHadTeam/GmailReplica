import { useEffect, useState } from "react";
import InboxHeader from "../components/InboxHeader/InboxHeader.jsx";
import LabelManager from "../components/LabelManager/LabelManager.jsx";
import MailDetail from "../components/MailDetail/MailDetail.jsx";
import MailList from "../components/MailsList/MailsList.jsx";
import Settings from "../components/Settings/Settings.jsx";
import Sidebar from "../components/Sidebar/Sidebar.jsx";
import { useTheme } from "../context/ThemeContext";
import { useLabelActions } from "../hooks/useLabelActions.js";
import { useMailActions } from "../hooks/useMailActions.js";

export function Inbox() {
    const { fetchMails } = useMailActions();
    const { fetchLabels } = useLabelActions();
    const { darkTheme } = useTheme();

    const [labelManagerOpen, setLabelManagerOpen] = useState(false);
    const [settingsOpen, setSettingsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [openMail, setOpenMail] = useState(null);

    const toggleSettings = () => {
        setSettingsOpen((prev) => !prev);
        if (labelManagerOpen) setLabelManagerOpen(false);
    };

    const toggleLabelManager = () => {
        setLabelManagerOpen((prev) => !prev);
        if (settingsOpen) setSettingsOpen(false);
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
            <button
                className={`btn btn-sm rounded-circle d-flex align-items-center justify-content-center ${
                    darkTheme ? "btn-secondary" : "btn-outline-secondary"
                }`}
                style={{ width: "40px", height: "40px" }}
                onClick={() => {
                    toggleSettings();
                    console.log("Settings clicked");
                }}
            >
                <span className="material-symbols-rounded">settings</span>
            </button>
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
                            <MailDetail mail={openMail} />
                        ) : (
                            <MailList
                                openMail={openMail}
                                setOpenMail={setOpenMail}
                                searchQuery={searchQuery}
                            />
                        )}

                        {labelManagerOpen && (
                            <LabelManager
                                toggleLabelManager={toggleLabelManager}
                            />
                        )}
                    </div>
                </div>
                {settingsOpen && <Settings toggleSettings={toggleSettings} />}
            </div>
        </div>
    );
}
