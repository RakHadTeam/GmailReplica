import { useState } from "react";

export default function useLabels() {
    const [labels, setLabels] = useState([]);
    const [starredIds, setStarredIds] = useState([]);

    const fetchLabels = async () => {
        try {
            const res = await fetch("/api/labels", { credentials: "include" });
            if (!res.ok) throw new Error(`Fetch labels failed: ${res.status}`);
            const data = await res.json();
            setLabels(data);
            const starredLabel = data.find((l) => l.name === "Starred");
            setStarredIds(
                Array.isArray(starredLabel?.mails) ? starredLabel.mails : []
            );
        } catch (err) {
            console.error(err);
        }
    };

    return { labels, setLabels, starredIds, setStarredIds, fetchLabels };
}
