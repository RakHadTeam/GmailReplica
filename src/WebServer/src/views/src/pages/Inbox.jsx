import { useEffect } from "react";
import ContextMenu from "../components/ContextMenu/ContextMenu";
import InboxHeader from "../components/InboxHeader/InboxHeader.jsx";
import LabelManager from "../components/LabelManager/LabelManager.jsx";
import MailList from "../components/MailsList/MailsList.jsx";
import Settings from "../components/Settings/Settings.jsx";
import Sidebar from "../components/Sidebar/Sidebar.jsx";
import { useTheme } from "../context/ThemeContext";
import useLabels from "../hooks/useLabels.js";
import useMails from "../hooks/useMails.js";
import useUIs from "../hooks/useUIs.js";

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
                <div
                    style={{
                        width: "240px",
                        flexShrink: 0,
                        minHeight: "100vh",
                    }}
                    className={darkTheme ? `bg-dark` : `bg-light`}
                >
                    <Sidebar />
                </div>
                <div
                    className="flex-grow-1"
                    style={{ overflowY: "auto", overflowX: "hidden" }}
                >
                    <div className="py-4 px-3 w-100">
                        <InboxHeader />

                        <MailList />

                        <ContextMenu />

                        {labelManagerOpen && <LabelManager />}
                    </div>
                </div>
                {settingsOpen && <Settings />}
            </div>
        </div>
    );
}
