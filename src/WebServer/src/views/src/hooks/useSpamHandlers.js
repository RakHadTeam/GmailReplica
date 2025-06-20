import useLabels from "./useLabels.js";
import useMails from "./useMails.js";
import useUIs from "./useUIs.js";

export default function useSpamHandlers() {
    const { labels, setLabels, setSpammedIds } = useLabels();
    const { selectedMails } = useMails();
    const { setContextMenu } = useUIs();

    const handleToggleSpam = async (id) => {
        setContextMenu(null);

        const spamLabel = labels.find((l) => l.name === "Spam");
        if (!spamLabel) {
            console.error("Spam label not found");
            return;
        }

        const applied =
            Array.isArray(spamLabel.mails) && spamLabel.mails.includes(id);

        if (applied) setSpammedIds((prev) => prev.filter((x) => x !== id));
        else setSpammedIds((prev) => [...prev, id]);

        const url = applied
            ? `/api/labels/${spamLabel.id}/${id}`
            : `/api/labels/${spamLabel.id}`;

        const opts = applied
            ? { method: "DELETE", credentials: "include" }
            : {
                  method: "POST",
                  credentials: "include",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ mailId: id }),
              };

        try {
            fetch(url, opts);
            setLabels((prev) =>
                prev.map((label) =>
                    label.id === spamLabel.id
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

    const handleToggleSpamBulk = async () => {
        const spamLabel = labels.find((l) => l.name === "Spam");
        if (!spamLabel) {
            console.error("Spam label not found");
            return;
        }

        const areSomeSpammed = selectedMails.some((id) =>
            spamLabel.mails.includes(id)
        );

        const applySpam = !areSomeSpammed;

        for (const id of selectedMails) {
            const isSpammed = spamLabel.mails.includes(id);
            if ((applySpam && !isSpammed) || (!applySpam && isSpammed)) {
                await handleToggleSpam(id);
            }
        }

        setContextMenu(null);
    };

    return { handleToggleSpam, handleToggleSpamBulk };
}
