import { useState } from "react";

export default function useMailState() {
    const [mails, setMails] = useState([]);

    const fetchMails = async () => {
        try {
            const res = await fetch("/api/mails", { credentials: "include" });
            if (!res.ok) throw new Error(`Fetch mails failed: ${res.status}`);
            const data = await res.json();
            const enriched = await Promise.all(
                data.map(async (mail) => {
                    const uRes = await fetch(`/api/users/${mail.recipient}`, {
                        credentials: "include",
                    });
                    const user = uRes.ok ? await uRes.json() : {};
                    return {
                        ...mail,
                        recipientName:
                            user.fullname || user.name || mail.recipient,
                        recipientEmail: user.email || "",
                        recipientPicture: user.picture || null,
                    };
                })
            );
            setMails(enriched);
        } catch (err) {
            console.error(err);
        }
    };

    return { mails, fetchMails };
}
