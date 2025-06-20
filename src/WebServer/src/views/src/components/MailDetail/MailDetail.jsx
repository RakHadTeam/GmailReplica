import { useEffect } from "react";
import { useTheme } from "../../context/ThemeContext.jsx";
import useMails from "../../hooks/useMails.js";
import useUIs from "../../hooks/useUIs.js";
import MailDetailHeader from "./MailDetailHeader";
import MailSenderInfo from "./MailSenderInfo";
import MailBodyContent from "./MailBodyContent";

export default function MailDetail({ handleCloseDetail }) {
    const { darkTheme } = useTheme();
    const { openMailId } = useUIs();
    const { mails, setSelectedMails } = useMails();

    useEffect(() => {
        setSelectedMails(openMailId ? [openMailId] : []);
    }, [openMailId]);

    if (!openMailId) return null;

    const mail = mails.find((mail) => mail.id === openMailId);
    if (!mail) return null;

    return (
        <div
            className={`card mt-4 border-1 shadow-sm rounded-4 ${
                darkTheme ? "bg-dark text-white border-secondary" : "bg-white text-dark"
            }`}
        >
            <MailDetailHeader mail={mail} />
            <div className="card-body">
                <MailSenderInfo mail={mail} />
                <MailBodyContent mail={mail} />
            </div>
        </div>
    );
}
