import useLabels from "./useLabels.js";
import useMails from "./useMails.js";
import useUIs from "./useUIs.js";

export default function useLabelHandlers() {
    const { labels, setLabels, fetchLabels } = useLabels();
    const { selectedMails, fetchMails } = useMails();
    const { contextMenu } = useUIs();

    const handleLabelToggleOnMailId = async (labelId, mailId) => {
        const label = labels.find((l) => l.id === labelId) || {};
        const applied =
            Array.isArray(label.mails) && label.mails.includes(mailId);

        const url = applied
            ? `/api/labels/${labelId}/${mailId}`
            : `/api/labels/${labelId}`;

        const opts = applied
            ? { method: "DELETE", credentials: "include" }
            : {
                  method: "POST",
                  credentials: "include",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ mailId }),
              };

        fetch(url, opts).catch(console.error);

        setLabels((prev) =>
            prev.map((l) =>
                l.id === labelId
                    ? {
                          ...l,
                          mails: applied
                              ? l.mails.filter((id) => id !== mailId)
                              : [...(l.mails || []), mailId],
                      }
                    : l
            )
        );
    };
    const handleLabelToggle = async (labelId) => {
        const targets = selectedMails.length
            ? selectedMails
            : [contextMenu.mailId];

        for (let mailId of targets) {
            handleLabelToggleOnMailId(labelId, mailId);
        }

        fetchLabels();
        fetchMails();
    };

    return { handleLabelToggle, handleLabelToggleOnMailId };
}
