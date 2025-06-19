import useLabels from "./useLabels.js";
import useMails from "./useMails.js";
import useUIs from "./useUIs.js";

export default function useMailHandlers() {
    const { filteredMails, selectedMails, setSelectedMails, setMails } =
        useMails();
    const { setOpenMailId, setContextMenu } = useUIs();
    const { labels, setLabels, setBinnedIds } = useLabels();

    const handleOpenMail = (mailId) => setOpenMailId(mailId);
    const handleCloseDetail = () => setOpenMailId(null);

    const handleSelect = (id) =>
        setSelectedMails((prev) =>
            prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
        );

    const handleSelectAll = () => {
        const ids = filteredMails.map((m) => m.id);
        setSelectedMails((prev) => (prev.length === ids.length ? [] : ids));
    };

    const handleDelete = (id) => {
        const binLabel = labels.find((label) => label.name === "Bin");
        console.log("binLabel", binLabel);
        if (binLabel && binLabel.mails.includes(id)) {
            try {
                fetch(`/api/mails/${id}`, {
                    method: "DELETE",
                    credentials: "include",
                });
            } catch (err) {
                console.error(err);
            }
            setMails((prev) => prev.filter((mail) => mail.id !== id));
        } else {
            // add to bin label
            try {
                fetch(`/api/labels/${binLabel.id}/`, {
                    method: "POST",
                    credentials: "include",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ mailId: id }),
                });
                setLabels((prev) =>
                    prev.map((label) =>
                        label.id === binLabel.id
                            ? { ...label, mails: [...label.mails, id] }
                            : label
                    )
                );
                setBinnedIds((prev) => [...prev, id]);
            } catch (err) {
                console.error(err);
            }
        }
        setContextMenu(null);
    };

    const handleDeleteBulk = () => {
        for (const mailId of selectedMails) {
            handleDelete(mailId);
        }
        setMails((prev) =>
            prev.filter((mail) => !selectedMails.includes(mail.id))
        );
        setSelectedMails([]);
        setContextMenu(null);
    };

    const handleUnbinBulk = () => {
        const binLabel = labels.find((label) => label.name === "Bin");
        if (!binLabel) return;
        for (const mailId of selectedMails) {
            // remove from bin label
            fetch(`/api/labels/${binLabel.id}/${mailId}`, {
                method: "DELETE",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
            })
                .then(() => {
                    setLabels((prev) =>
                        prev.map((label) =>
                            label.id === binLabel.id
                                ? {
                                      ...label,
                                      mails: label.mails.filter(
                                          (id) => id !== mailId
                                      ),
                                  }
                                : label
                        )
                    );
                    setBinnedIds((prev) => prev.filter((id) => id !== mailId));
                })
                .catch((err) => console.error(err));
        }
        setSelectedMails([]);
        setContextMenu(null);
    };

    return {
        handleOpenMail,
        handleUnbinBulk,
        handleCloseDetail,
        handleSelect,
        handleSelectAll,
        handleDelete,
        handleDeleteBulk,
    };
}
