import { useAuth } from "../context/AuthContext.js";
import { useMailApp } from "../context/MailAppContext";
import { useLabelActions } from "./useLabelActions";

export function useMailActions() {
    const {
        mailState: { setMails },
        uiState: { selectedIds, setSelectedIds },
        labelState: { setLabels },
    } = useMailApp();

    const { setSignedin } = useAuth();

    const { getLabel, updateLabel, fetchLabels } = useLabelActions();

    const fetchMails = async () => {
        try {
            const response = await fetch("/api/mails", {
                credentials: "include",
            });
            if (response.status === 401 || response.status === 403) {
                setSignedin(false);
                return;
            }
            if (response.status === 400)
                throw new Error(`Fetch mails failed: ${response.status}`);
            const rawMails = await response.json();

            const enriched = await Promise.all(
                rawMails.map(async (mail) => {
                    if (mail.draft && !mail.recipient) {
                        return {
                            ...mail,
                            recipientName: "",
                            recipientEmail: "",
                            recipientPicture: null,
                        };
                    }
                    const userResponse = await fetch(
                        `/api/users/${mail.recipient}`,
                        {
                            credentials: "include",
                        }
                    );
                    if (response.status === 401 || response.status === 403) {
                        setSignedin(false);
                        return;
                    }
                    const recipientUser = userResponse.ok
                        ? await userResponse.json()
                        : {};
                    return {
                        ...mail,
                        recipientName: recipientUser.fullname || mail.recipient,
                        recipientEmail: recipientUser.email || "",
                        recipientPicture: recipientUser.picture || null,
                    };
                })
            );

            setMails(enriched);
        } catch (err) {
            console.error(err);
        }
    };

    const deleteMail = async (id) => {
        const bin = getLabel("Bin");
        if (!bin) return;
        const isBinned = bin.mails.includes(id);

        if (isBinned) {
            const response = await fetch(`/api/mails/${id}`, {
                method: "DELETE",
                credentials: "include",
            });
            if (response.status === 401 || response.status === 403) {
                setSignedin(false);
                return;
            }
            if (response.status === 400)
                throw new Error(`Delete mail failed: ${response.status}`);
            setMails((prev) => prev.filter((m) => m.id !== id));
        } else {
            updateLabel(bin.id, id, true);
        }
    };

    const deleteBulk = () => {
        for (const id of selectedIds) {
            deleteMail(id);
        }

        const bin = getLabel("Bin");
        if (!bin) return;
        setLabels((prev) =>
            prev.map((l) => {
                if (l.id !== bin.id) return l;
                const mails = new Set(l.mails || []);
                selectedIds.forEach((id) => mails.add(id));
                return { ...l, mails: [...mails] };
            })
        );

        setSelectedIds([]);
    };

    const unbinBulk = () => {
        const bin = getLabel("Bin");
        if (!bin) return;

        for (const id of selectedIds) {
            updateLabel(bin.id, id, false);
        }

        setLabels((prev) =>
            prev.map((l) => {
                if (l.id !== bin.id) return l;
                const mails = new Set(l.mails || []);
                selectedIds.forEach((id) => mails.delete(id));
                return { ...l, mails: [...mails] };
            })
        );

        setSelectedIds([]);
    };

    async function sendOrSaveMail({
        draftMail,
        recipient,
        subject,
        body,
        isDraft,
        onSuccess,
        onError,
    }) {
        if (!isDraft && !recipient) {
            onError?.("Recipient is required.");
            return;
        }

        const payload = { recipient, subject, body, draft: isDraft };
        const url = draftMail ? `/api/mails/${draftMail.id}` : "/api/mails";
        const method = draftMail ? "PATCH" : "POST";

        try {
            const response = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify(payload),
            });
            if (response.status === 401 || response.status === 403) {
                setSignedin(false);
                return;
            }

            if (response.status === 400) {
                const err = await response.json().catch(() => ({}));
                throw new Error(err.error || "Save failed");
            }

            onSuccess?.();
        } catch (err) {
            onError?.(err.message ?? "An error occurred");
        }
        await fetchMails();
        await fetchLabels();
    }

    return {
        fetchMails,
        deleteMail,
        deleteBulk,
        unbinBulk,
        sendOrSaveMail,
    };
}
