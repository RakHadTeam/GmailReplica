import { useCallback } from "react";
import { useAuth } from "../context/AuthContext.js";
import { useMailApp } from "../context/MailAppContext.js";

export function useLabelActions() {
    const {
        labelState: { labels, setLabels },
    } = useMailApp();

    const { setSignedin } = useAuth();

    const getLabelById = useCallback(
        (id) => labels.find((l) => l.id === id),
        [labels]
    );

    const getLabelByName = useCallback(
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
        const response = await fetch(url, opts);
        if (response.status === 401 || response.status === 403) {
            setSignedin(false);
            return;
        }
        if (response.status === 400) {
            throw new Error("Failed to update label");
        }

        if (response.status === 204) {
            // update local state
            const label = getLabelById(labelId);
            if (label) {
                setLabels((prev) =>
                    prev.map((l) => {
                        if (l.id !== labelId) return l;
                        const mails = new Set(l.mails || []);
                        if (apply) {
                            mails.add(mailId);
                        } else {
                            mails.delete(mailId);
                        }
                        return { ...l, mails: [...mails] };
                    })
                );
            }
        }
    };

    const editLabel = async (labelId, newName) => {
        const response = await fetch(`/api/labels/${labelId}`, {
            method: "PATCH",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name: newName }),
        });
        if (response.status === 401 || response.status === 403) {
            setSignedin(false);
            return;
        }
        if (response.status !== 204) {
            const data = await response.json();
            throw new Error(data.error || "Failed to update label");
        }
        setLabels((prev) =>
            prev.map((l) => (l.id === labelId ? { ...l, name: newName } : l))
        );
    };

    const toggleLabel = async (labelId, mailId, apply) => {
        const label = getLabelById(labelId);
        if (!label) return;
        const applied = label.mails?.includes(mailId);
        const shouldApply = apply != null ? apply : !applied;

        await updateLabel(label.id, mailId, shouldApply);

    };

    const toggleLabelBulk = async (labelId, mailIds, apply) => {
        for (const id of mailIds) {
            await toggleLabel(labelId, id, apply);
        }
    };

    const fetchLabels = async () => {
        try {
            const response = await fetch("/api/labels", {
                credentials: "include",
            });
            if (response.status === 401 || response.status === 403) {
                setSignedin(false);
                return;
            }
            if (response.status === 400)
                throw new Error("Failed to fetch labels");
            const data = await response.json();
            setLabels(data);
        } catch (err) {
            console.error(err);
        }
    };

    const createLabel = async (labelName) => {
        const response = await fetch("/api/labels", {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name: labelName }),
        });
        if (response.status === 401 || response.status === 403) {
            setSignedin(false);
            return;
        }
        if (response.status !== 201) {
            const data = await response.json();
            throw new Error(data.error || "Failed to create label");
        }
        const newLabel = await response.json();
        setLabels((prev) => [
            ...prev,
            { ...newLabel, name: labelName, mails: [] },
        ]);
    };

    const deleteLabel = async (labelId) => {
        try {
            const response = await fetch(`/api/labels/${labelId}`, {
                method: "DELETE",
                credentials: "include",
            });
            if (response.status === 401 || response.status === 403) {
                setSignedin(false);
                return;
            }
            if (response.status !== 204)
                throw new Error("Failed to delete label");
            setLabels((prev) => prev.filter((l) => l.id !== labelId));
        } catch (err) {
            console.error(err);
        }
    };

    return {
        getLabel: getLabelById,
        updateLabel,
        toggleLabel,
        toggleLabelBulk,
        fetchLabels,
        createLabel,
        deleteLabel,
        editLabel,
        getLabelByName,
    };
}
