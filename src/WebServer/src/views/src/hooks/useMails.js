import { createContext, useContext, useEffect, useState } from "react";
import useLabels from "./useLabels.js";

const MailContext = createContext();

export const MailProvider = ({ children }) => {
    const [mails, setMails] = useState([]);
    const [filteredMails, setFilteredMails] = useState([]);
    const { starredIds, labels, activeLabel } = useLabels();
    const [selectedMails, setSelectedMails] = useState([]);

    useEffect(() => {
        setFilteredMails(
            mails.filter((mail) => {
                if (activeLabel === "All") return true;
                if (activeLabel === "Starred")
                    return starredIds.includes(mail.id);
                const lbl = labels.find((l) => l.id === activeLabel);
                return Array.isArray(lbl?.mails) && lbl.mails.includes(mail.id);
            })
        );
    }, [mails, activeLabel, starredIds, labels]);

    const fetchMails = async () => {
        try {
            const res = await fetch("/api/mails", { credentials: "include" });
            if (!res.ok) throw new Error(`Fetch mails failed: ${res.status}`);
            const data = await res.json();
            const enriched = await Promise.all(
                data.map(async (mail) => {
                    const uRes = await fetch(`/api/users/${mail.recipient}`, {
                        credentials: "include",
                    });
                    const user = uRes.ok ? await uRes.json() : {};
                    return {
                        ...mail,
                        recipientName: user.fullname || user.name || mail.recipient,
                        recipientEmail: user.email || "",
                        recipientPicture: user.picture || null,
                    };
                })
            );
            setMails(enriched);
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <MailContext.Provider value={{
            mails,
            setMails,
            fetchMails,
            filteredMails,
            setFilteredMails,
            selectedMails,
            setSelectedMails,
        }}>
            {children}
        </MailContext.Provider>
    );
};

export default function useMails() {
    return useContext(MailContext);
}
