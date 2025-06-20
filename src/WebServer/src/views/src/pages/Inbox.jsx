import { useEffect } from "react";
import ContextMenu from "../components/ContextMenu";
import InboxHeader from "../components/InboxHeader";
import LabelManager from "../components/LabelManager";
import MailList from "../components/MailsList";
import SettingsPanel from "../components/SettingsPanel";
import Sidebar from "../components/Sidebar.jsx";
import { useTheme } from "../context/ThemeContext";
import useLabels from "../hooks/useLabels.js";
import useMails from "../hooks/useMails.js";
import useUIs from "../hooks/useUIs.js";
import SearchBar from "../components/SearchBar/SearchBar.jsx";

export function Inbox() {
    const { fetchMails, mails } = useMails();
    const { fetchLabels, labels } = useLabels();
    const { labelManagerOpen, settingsOpen } = useUIs();
    const { darkTheme } = useTheme();

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
                <div style={{ width: "240px", flexShrink: 0, minHeight: "100vh" }} className={darkTheme ? `bg-dark` : `bg-light`}>
                    <Sidebar />
                </div>
                <div className="flex-grow-1" style={{  overflowY: "auto", overflowX: "hidden" }}>
                    <div className="py-4 px-3 w-100">

                        <InboxHeader />

                        <MailList />

                        <ContextMenu />

                        {labelManagerOpen && <LabelManager />}
                    </div>
                </div>
                {settingsOpen && <SettingsPanel />}
            </div>
        </div>
    );
}
