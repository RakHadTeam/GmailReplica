import { useMemo, useState } from "react";
import { useMailApp } from "../../context/MailAppContext.js";
import { useTheme } from "../../context/ThemeContext";

export default function SidebarNavigation() {
    const { darkTheme } = useTheme();
    const {
        labelState: { labels },
        mailState: { mails },
        uiState: { activeLabel, setActiveLabel },
    } = useMailApp();

    const [starredIds, setStarredIds] = useState([]);
    const [spammedIds, setSpammedIds] = useState([]);
    const [binnedIds, setBinnedIds] = useState([]);
    const [sentIds, setSentIds] = useState([]);

    useMemo(() => {
        const starredLabel = labels.find((label) => label.id === "Starred");
        const spamLabel = labels.find((label) => label.id === "Spam");
        const binLabel = labels.find((label) => label.id === "Bin");
        const sentLabel = labels.find((label) => label.id === "Sent");

        setStarredIds(starredLabel ? starredLabel.mails : []);
        setSpammedIds(spamLabel ? spamLabel.mails : []);
        setBinnedIds(binLabel ? binLabel.mails : []);
        setSentIds(sentLabel ? sentLabel.mails : []);
    }, [labels]);

    return (
        <div className="mt-2 d-flex flex-column gap-2">
            {[
                {
                    id: "All",
                    icon: "inbox",
                    label: "Inbox",
                    count: mails.filter(
                        (m) =>
                            !m.draft &&
                            !binnedIds.includes(m.id) &&
                            !spammedIds.includes(m.id) &&
                            !(
                                sentIds.includes(m.id) &&
                                m.recipient !== m.sender
                            )
                    ).length,
                },
                {
                    id: "Starred",
                    icon: "star",
                    label: "Starred",
                    count: starredIds.filter((id) => !binnedIds.includes(id))
                        .length,
                },
                {
                    id: "Sent",
                    icon: "send",
                    label: "Sent",
                    count: sentIds.filter((id) => !binnedIds.includes(id))
                        .length,
                },
                {
                    id: "Drafts",
                    icon: "draft",
                    label: "Drafts",
                    count: mails.filter(
                        (m) => m.draft && !binnedIds.includes(m.id)
                    ).length,
                },
                {
                    id: "Spam",
                    icon: "report",
                    label: "Spam",
                    count: mails.filter((m) => spammedIds.includes(m.id))
                        .length,
                },
                {
                    id: "Bin",
                    icon: "delete",
                    label: "Bin",
                    count: mails.filter((m) => binnedIds.includes(m.id)).length,
                },
            ].map(({ id, icon, label, count }) => (
                <button
                    key={id}
                    className={`btn d-flex align-items-center gap-2 text-start ${
                        activeLabel === id ? "active" : ""
                    } ${darkTheme ? "text-light" : "text-dark"}`}
                    onClick={() => setActiveLabel(id)}
                >
                    <span className="material-symbols-rounded">{icon}</span>
                    {label}
                    {typeof count !== "undefined" && (
                        <span className="ms-auto">{count}</span>
                    )}
                </button>
            ))}
            <hr className="my-2" />
        </div>
    );
}
