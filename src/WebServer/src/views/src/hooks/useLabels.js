import { createContext, useContext, useState } from "react";

const LabelContext = createContext();

export const LabelProvider = ({ children }) => {
    const [labels, setLabels] = useState([]);
    const [starredIds, setStarredIds] = useState([]);
    const [activeLabel, setActiveLabel] = useState("All");

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


    return (
        <LabelContext.Provider value={{
            labels,
            setLabels,
            starredIds,
            setStarredIds,
            fetchLabels,
            activeLabel,
            setActiveLabel,
        }}>
            {children}
        </LabelContext.Provider>
    );
};

export default function useLabels() {
    return useContext(LabelContext);
}
