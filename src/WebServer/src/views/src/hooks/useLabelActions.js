// src/hooks/useLabelActions.js
import { useCallback } from "react";
import { useMailApp } from "../context/MailAppContext";

export function useLabelActions() {
    const {
        labelState: { labels, setLabels },
    } = useMailApp();

    const getLabel = useCallback(
        (id) => labels.find((l) => l.id === id),
        [labels]
    );

    const updateLabel = async (labelId, mailId, apply) => {
        const url = `/api/labels/${labelId}${apply ? "" : "/" + mailId}`;
        const opts = apply
            ? {
                  method: "POST",
                  credentials: "include",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ mailId }),
              }
            : {
                  method: "DELETE",
                  credentials: "include",
              };
        await fetch(url, opts);
    };

    const toggleLabel = async (labelId, mailId, apply) => {
        console.log(apply);
        const label = getLabel(labelId);
        if (!label) return;
        const applied = label.mails?.includes(mailId);
        const shouldApply = apply != null ? apply : !applied;

        await updateLabel(label.id, mailId, shouldApply);

        setLabels((prev) =>
            prev.map((l) => {
                if (l.id !== label.id) return l;

                const mails = new Set(l.mails || []);

                if (shouldApply) {
                    mails.add(mailId);
                } else {
                    mails.delete(mailId);
                }

                return { ...l, mails: [...mails] };
            })
        );
    };

    const toggleLabelBulk = async (labelId, mailIds, apply) => {
        for (const id of mailIds) {
            console.log(
                `Toggling label ${labelId} for mail ${id} with apply=${apply}`
            );
            await toggleLabel(labelId, id, apply);
        }
    };

    const fetchLabels = async () => {
        try {
            const res = await fetch("/api/labels", { credentials: "include" });
            if (!res.ok) throw new Error("Failed to fetch labels");
            const data = await res.json();
            setLabels(data);
        } catch (err) {
            console.error(err);
        }
    };

    const createLabel = async (labelName) => {
        try {
            const res = await fetch("/api/labels", {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name: labelName }),
            });
            if (!res.ok) throw new Error("Failed to create label");
            const newLabel = await res.json();
            setLabels((prev) => [...prev, newLabel]);
        } catch (err) {
            console.error(err);
        }
    };

    return {
        getLabel,
        updateLabel,
        toggleLabel,
        toggleLabelBulk,
        fetchLabels,
        createLabel,
    };
}
