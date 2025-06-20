export default function SettingsBlacklist() {
    const handleAdd = async (e) => {
        if (e.key !== "Enter") return;
        e.preventDefault();
        const url = e.target.value.trim();
        if (!url) return;

        try {
            const res = await fetch("/api/blacklist", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ url }),
            });
            if (res.ok) {
                alert("URL added to blacklist!");
                e.target.value = "";
            } else {
                alert("Failed to add URL.");
            }
        } catch (err) {
            console.error(err);
            alert("Error adding URL.");
        }
    };

    const handleRemove = async (e) => {
        if (e.key !== "Enter") return;
        e.preventDefault();
        const url = e.target.value.trim();
        if (!url) return;

        try {
            const res = await fetch(
                `/api/blacklist/${encodeURIComponent(url)}`,
                {
                    method: "DELETE",
                }
            );
            if (res.ok) {
                alert("URL removed from blacklist!");
                e.target.value = "";
            } else {
                alert("Failed to remove URL.");
            }
        } catch (err) {
            console.error(err);
            alert("Error removing URL.");
        }
    };

    return (
        <>
            <div className="mb-3">
                <label htmlFor="addUrl" className="form-label">
                    Add URL to Blacklist
                </label>
                <input
                    type="text"
                    className="form-control"
                    id="addUrl"
                    placeholder="https://example.com"
                    onKeyDown={handleAdd}
                />
            </div>

            <div className="mb-3">
                <label htmlFor="removeUrl" className="form-label">
                    Remove URL from Blacklist
                </label>
                <input
                    type="text"
                    className="form-control"
                    id="removeUrl"
                    placeholder="https://example.com"
                    onKeyDown={handleRemove}
                />
            </div>
        </>
    );
}
