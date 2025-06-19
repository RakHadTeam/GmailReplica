import useLabels from "./useLabels.js";
import useMails from "./useMails.js";
import useUiState from "./useUIStates.js";

// useLabelHandlers.js
export default function useLabelHandlers() {
    const { labels, fetchLabels } = useLabels();
    const { selectedMails, fetchMails } = useMails();
    const { setContextMenu, contextMenu, setShowLabelMenu } = useUiState();

    const handleLabelToggle = async (labelId) => {
        const targets = selectedMails.length
            ? selectedMails
            : [contextMenu.mailId];

        for (let mailId of targets) {
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

            await fetch(url, opts).catch(console.error);
        }

        await fetchLabels();
        await fetchMails();
        setShowLabelMenu(false);
        setContextMenu(null);
    };

    return { handleLabelToggle };
}
