import { createContext, useContext, useEffect, useState } from "react";
import useLabels from "./useLabels.js";

const MailContext = createContext();

export const MailProvider = ({ children }) => {
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [mails, setMails] = useState([]);
    const [filteredMails, setFilteredMails] = useState([]);
    const { starredIds, labels, activeLabel, binnedIds, spammedIds } =
        useLabels();
    const [selectedMails, setSelectedMails] = useState([]);

    useEffect(() => {
        setFilteredMails(
            mails.filter((mail) => {
                if (activeLabel === "Bin") return binnedIds.includes(mail.id);
                if (activeLabel === "Spam") return spammedIds.includes(mail.id);
                if (activeLabel === "Drafts")
                    return mail.draft && !binnedIds.includes(mail.id);
                if (activeLabel === "All")
                    return (
                        !binnedIds.includes(mail.id) &&
                        !mail.draft &&
                        !spammedIds.includes(mail.id)
                    );
                if (activeLabel === "Starred")
                    return starredIds.includes(mail.id);
                const lbl = labels.find((l) => l.id === activeLabel);
                return Array.isArray(lbl?.mails) && lbl.mails.includes(mail.id);
            })
        );
    }, [mails, binnedIds, activeLabel, starredIds, spammedIds, labels]);

    const search = async (q) => {
        setSearchQuery(q);
        if (!q.trim()) {
            setSearchResults([]);
            return;
        }
        try {
            const res = await fetch(
                `/api/mails/search/${encodeURIComponent(q)}`,
                {
                    credentials: "include",
                }
            );
            if (!res.ok) throw new Error("search failed");
            const data = await res.json();
            setSearchResults(data);
        } catch (err) {
            console.error(err);
            setSearchResults([]);
        }
    };

    const fetchMails = async () => {
        try {
            const res = await fetch("/api/mails", { credentials: "include" });
            if (!res.ok) throw new Error(`Fetch mails failed: ${res.status}`);
            const data = await res.json();

            const enriched = await Promise.all(
                data.map(async (mail) => {
                    if (mail.draft && !mail.recipient) {
                        return {
                            ...mail,
                            recipientName: "",
                            recipientEmail: "",
                            recipientPicture: null,
                        };
                    }
                    const uRes = await fetch(`/api/users/${mail.recipient}`, {
                        credentials: "include",
                    });
                    const user = uRes.ok ? await uRes.json() : {};
                    return {
                        ...mail,
                        recipientName: user.fullname || mail.recipient,
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
        <MailContext.Provider
            value={{
                mails,
                setMails,
                fetchMails,

                filteredMails,
                setFilteredMails,

                selectedMails,
                setSelectedMails,

                search,
                searchQuery,
                setSearchQuery,
                searchResults,
            }}
        >
            {children}
        </MailContext.Provider>
    );
};

export default function useMails() {
    return useContext(MailContext);
}
