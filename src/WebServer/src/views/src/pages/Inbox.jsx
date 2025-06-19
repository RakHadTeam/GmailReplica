import { useEffect } from "react";
import ContextMenu from "../components/ContextMenu";
import InboxHeader from "../components/InboxHeader";
import LabelManager from "../components/LabelManager";
import MailDetail from "../components/MailDetail";
import MailFilter from "../components/MailFilter";
import MailList from "../components/MailsList";
import SettingsPanel from "../components/SettingsPanel";
import { useTheme } from "../context/ThemeContext";
import useLabels from "../hooks/useLabels.js";
import useMails from "../hooks/useMails.js";
import useUIs from "../hooks/useUIs.js";

export function Inbox() {
    const { fetchMails } = useMails();
    const { fetchLabels } = useLabels();
    const { settingsOpen, labelManagerOpen } = useUIs();
    const { darkTheme } = useTheme();

    useEffect(() => {
        fetchMails();
        fetchLabels();
        const mid = setInterval(fetchMails, 15000);
        return () => clearInterval(mid);
    }, []);

    return (
        <div
            className={`min-vh-100 w-100 ${
                darkTheme ? "bg-black text-white" : "bg-light text-dark"
            }`}
        >
            <div className="container py-4">
                <InboxHeader />

                <MailFilter />

                <MailList />

                <ContextMenu />

                {settingsOpen && <SettingsPanel />}

                {labelManagerOpen && <LabelManager />}
            </div>
        </div>
    );
}
