// src/hooks/useLabelActions.js
import { useCallback } from "react";
import { useMailApp } from "../context/MailAppContext";

export function useLabelActions() {
    const {
        labelState: { labels, setLabels },
    } = useMailApp();

    const getLabel = useCallback(
        (name) => labels.find((l) => l.name === name),
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
        await fetch(url, opts).catch(console.error);
    };

    const toggleLabel = async (labelName, mailId) => {
        const label = getLabel(labelName);
        if (!label) return;
        const applied = label.mails?.includes(mailId);
        await updateLabel(label.id, mailId, !applied);

        setLabels((prev) =>
            prev.map((l) =>
                l.id === label.id
                    ? {
                          ...l,
                          mails: applied
                              ? l.mails.filter((id) => id !== mailId)
                              : [...(l.mails || []), mailId],
                      }
                    : l
            )
        );
    };

    const toggleLabelBulk = async (labelName, mailIds) => {
        for (const id of mailIds) {
            await toggleLabel(labelName, id);
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

    return {
        getLabel,
        updateLabel,
        toggleLabel,
        toggleLabelBulk,
        fetchLabels,
    };
}
