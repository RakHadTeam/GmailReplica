import { createContext, useContext, useMemo, useState } from "react";

const MailAppContext = createContext(null);

export function MailAppProvider({ children }) {
    const [labels, setLabels] = useState([]);
    const [mails, setMails] = useState([]);
    const [selectedIds, setSelectedIds] = useState([]);
    const [activeLabel, setActiveLabel] = useState("All");

    useMemo(() => {
        setSelectedIds([]);
    }, [activeLabel]);

    const filteredMails = useMemo(() => {
        const getLabelMap = (...names) =>
            names.reduce((map, name) => {
                const label = labels.find((l) => l.name === name);
                if (label) map[name] = label.mails || [];
                return map;
            }, {});

        const labelMailMap = getLabelMap("Bin", "Spam", "Starred", "Sent");

        const isExcludedFromAll = (mail) => {
            if (labelMailMap.Bin?.includes(mail.id)) return true;
            if (labelMailMap.Spam?.includes(mail.id)) return true;
            if (
                labelMailMap.Sent?.includes(mail.id) &&
                mail.recipient !== mail.sender
            )
                return true;
            if (mail.draft) return true;
            return false;
        };

        return mails.filter((mail) => {
            if (["Bin", "Spam", "Starred", "Sent"].includes(activeLabel)) {
                return labelMailMap[activeLabel]?.includes(mail.id);
            }
            if (activeLabel === "Drafts") {
                return mail.draft && !labelMailMap.Bin?.includes(mail.id);
            }
            if (activeLabel === "All") {
                return !isExcludedFromAll(mail);
            }
            const custom = labels.find((l) => l.id === activeLabel);
            return custom?.mails?.includes(mail.id);
        });
    }, [labels, mails, activeLabel]);

    return (
        <MailAppContext.Provider
            value={{
                labelState: { labels, setLabels },
                mailState: { mails, setMails },
                uiState: {
                    selectedIds,
                    setSelectedIds,
                    activeLabel,
                    setActiveLabel,
                },
                filteredMails,
            }}
        >
            {children}
        </MailAppContext.Provider>
    );
}

export function useMailApp() {
    const ctx = useContext(MailAppContext);
    if (!ctx) throw new Error("useMailApp must be used within MailAppProvider");
    return ctx;
}
