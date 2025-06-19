// useLabelHandlers.js
export default function useLabelHandlers({
    labels,
    selectedMails,
    contextMenu,
    fetchLabels,
    fetchMails,
    setShowLabelMenu,
    setContextMenu,
}) {
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
