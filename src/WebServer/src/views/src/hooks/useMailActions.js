import { useAuth } from "../context/AuthContext.js";
import { useMailApp } from "../context/MailAppContext";
import defaultPicture from "../resources/default-profile-picture.svg";
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
                    let recipientUser = {};
                    let senderUser = {};

                    if (!mail.draft && mail.recipient) {
                        const recipientRes = await fetch(
                            `/api/users/${mail.recipient}`,
                            {
                                credentials: "include",
                            }
                        );
                        if (
                            recipientRes.status === 401 ||
                            recipientRes.status === 403
                        ) {
                            setSignedin(false);
                            return;
                        }
                        recipientUser = recipientRes.ok
                            ? await recipientRes.json()
                            : {};
                    }

                    if (!mail.draft && mail.sender) {
                        const senderRes = await fetch(
                            `/api/users/${mail.sender}`,
                            {
                                credentials: "include",
                            }
                        );
                        if (
                            senderRes.status === 401 ||
                            senderRes.status === 403
                        ) {
                            setSignedin(false);
                            return;
                        }
                        senderUser = senderRes.ok ? await senderRes.json() : {};
                    }

                    return {
                        ...mail,
                        recipientName:
                            recipientUser.fullname || mail.recipient || "",
                        recipientEmail: recipientUser.email || "",
                        recipientPicture:
                            recipientUser.picture || defaultPicture,
                        senderName: senderUser.fullname || mail.sender || "",
                        senderEmail: senderUser.email || "",
                        senderPicture: senderUser.picture || defaultPicture,
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
        if (!isDraft && !subject) {
            onError?.("Subject is required.");
            return;
        }
        if (!isDraft && !body) {
            onError?.("Body is required.");
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

            const err = await response.json().catch(() => ({}));
            if (response.status === 400) {
                throw new Error(err.error || "Save failed");
            }

            if (response.status !== 201 && response.status !== 204) {
                throw new Error(err.error || "An error occurred");
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
