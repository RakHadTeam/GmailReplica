import useLabels from "../../hooks/useLabels.js";

export default function LabelList({ searchTerm, setError }) {
    const { labels, setLabels } = useLabels();

    const handleDeleteLabel = async (id) => {
        try {
            const res = await fetch(`/api/labels/${id}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            if (!res.ok) throw new Error("Failed to delete label");
            setLabels(labels.filter((label) => label.id !== id));
        } catch (err) {
            console.error(err);
            setError("Error deleting label.");
        }
    };

    return (
        <ul className="list-group">
            {labels
                .filter(
                    (label) =>
                        !["starred", "bin", "spam"].includes(
                            label.name.toLowerCase()
                        )
                )
                .filter((label) =>
                    label.name.toLowerCase().includes(searchTerm.toLowerCase())
                )
                .map(({ id, name }) => (
                    <li
                        key={id}
                        className="list-group-item d-flex justify-content-between align-items-center"
                    >
                        {name}
                        <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => handleDeleteLabel(id)}
                        >
                            <span className="material-symbols-rounded">
                                delete
                            </span>
                        </button>
                    </li>
                ))}
        </ul>
    );
}
