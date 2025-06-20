import { useTheme } from "../../context/ThemeContext";

export default function SidebarNavigation({ mails, labelsState, setActiveLabel }) {
    const { darkTheme } = useTheme();
    const { activeLabel, starredIds, binnedIds, spammedIds, sentIds } = labelsState;

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
                            !sentIds.includes(m.id)
                    ).length,
                },
                {
                    id: "Starred",
                    icon: "star",
                    label: "Starred",
                    count: starredIds.filter((id) => !binnedIds.includes(id))
                        .length,
                },
                { id: "Snoozed", icon: "schedule", label: "Snoozed" },
                { id: "Sent", icon: "send", label: "Sent", count: sentIds.length },
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
