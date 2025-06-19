import useLabels from "./useLabels.js";
import useMails from "./useMails.js";
import useUiState from "./useUIStates.js";

// useStarHandlers.js
export default function useStarHandlers() {
    const { labels, fetchLabels, setStarredIds } = useLabels();
    const { selectedMails, fetchMails } = useMails();
    const { setContextMenu } = useUiState();
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
            await fetch(url, opts);
            await fetchLabels();
            await fetchMails();
        } catch (err) {
            console.error(err);
        }
    };

    const handleToggleStarBulk = () => {
        selectedMails.forEach(handleToggleStar);
        setContextMenu(null);
    };

    return { handleToggleStar, handleToggleStarBulk };
}
