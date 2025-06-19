import useMails from "./useMails.js";
import useUIs from "./useUIs.js";

export default function useMailHandlers() {
    const { filteredMails, selectedMails, setSelectedMails, setMails } =
        useMails();
    const { setOpenMailId, setContextMenu } = useUIs();

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
        setMails((prev) => prev.filter((mail) => mail.id !== id));
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
        setMails((prev) => prev.filter((mail) => !selectedMails.includes(mail.id)));
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
