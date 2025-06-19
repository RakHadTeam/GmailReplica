import useLabels from "./useLabels.js";
import useMails from "./useMails.js";
import useUIs from "./useUIs.js";

export default function useStarHandlers() {
    const { labels, setStarredIds, setLabels } = useLabels();
    const { selectedMails } = useMails();
    const { setContextMenu } = useUIs();

    const handleToggleStar = async (id) => {
        setContextMenu(null);

        const starredLabel = labels.find((l) => l.name === "Starred");
        if (!starredLabel) {
            console.error("Starred label not found");
            return;
        }

        const applied =
            Array.isArray(starredLabel.mails) &&
            starredLabel.mails.includes(id);

        const url = applied
            ? `/api/labels/${starredLabel.id}/${id}`
            : `/api/labels/${starredLabel.id}`;

        const opts = applied
            ? { method: "DELETE", credentials: "include" }
            : {
                  method: "POST",
                  credentials: "include",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ mailId: id }),
              };

        if (applied) setStarredIds((prev) => prev.filter((x) => x !== id));
        else setStarredIds((prev) => [...prev, id]);

        try {
            fetch(url, opts);
            setLabels((prev) =>
                prev.map((label) =>
                    label.id === starredLabel.id
                        ? {
                              ...label,
                              mails: applied
                                  ? label.mails.filter((x) => x !== id)
                                  : [...(label.mails || []), id],
                          }
                        : label
                )
            );
        } catch (err) {
            console.error(err);
        }
    };

    const handleToggleStarBulk = async () => {
        const starredLabel = labels.find((l) => l.name === "Starred");
        if (!starredLabel) {
            console.error("Starred label not found");
            return;
        }

        const areSomeStarred = selectedMails.some((id) =>
            starredLabel.mails.includes(id)
        );

        const applyStar = !areSomeStarred;

        for (const id of selectedMails) {
            const isStarred = starredLabel.mails.includes(id);
            if ((applyStar && !isStarred) || (!applyStar && isStarred)) {
                await handleToggleStar(id);
            }
        }

        setContextMenu(null);
    };

    return { handleToggleStar, handleToggleStarBulk };
}
