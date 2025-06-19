import useMails from "./useMails.js";
import useUiState from "./useUIStates.js";

// useMailHandlers.js
export default function useMailHandlers() {
    const { fetchMails, filteredMails, selectedMails, setSelectedMails } = useMails();
    const { setOpenMailId, setContextMenu } = useUiState();

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

    const handleDelete = async (id) => {
        try {
            await fetch(`/api/mails/${id}`, {
                method: "DELETE",
                credentials: "include",
            });
        } catch (err) {
            console.error(err);
        }
        await fetchMails();
        setContextMenu(null);
    };

    const handleDeleteBulk = async () => {
        await Promise.all(
            selectedMails.map((id) =>
                fetch(`/api/mails/${id}`, {
                    method: "DELETE",
                    credentials: "include",
                }).catch(console.error)
            )
        );
        await fetchMails();
        setSelectedMails([]);
        setContextMenu(null);
    };

    return {
        handleOpenMail,
        handleCloseDetail,
        handleSelect,
        handleSelectAll,
        handleDelete,
        handleDeleteBulk,
    };
}
