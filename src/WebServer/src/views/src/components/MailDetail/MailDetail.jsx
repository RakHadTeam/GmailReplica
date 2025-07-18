import { useEffect } from "react";
import { useMailApp } from "../../context/MailAppContext.js";
import { useTheme } from "../../context/ThemeContext.js";
import MailDetailBodyContent from "./MailDetailBodyContent.jsx";
import MailDetailHeader from "./MailDetailHeader.jsx";
import MailDetailSenderInfo from "./MailDetailSenderInfo.jsx";

export default function MailDetail({ mail }) {
    const { darkTheme } = useTheme();
    const {
        uiState: { setSelectedIds },
    } = useMailApp();

    useEffect(() => {
        setSelectedIds(mail ? [mail.id] : []);
    }, [mail, setSelectedIds]);

    if (!mail) return null;

    return (
        <div
            className={`card mt-4 shadow-sm rounded-4 ${
                darkTheme ? "bg-dark text-white " : "bg-white text-dark"
            }`}
        >
            <MailDetailHeader mail={mail} />
            <div className="card-body">
                <MailDetailSenderInfo mail={mail} />
                <MailDetailBodyContent mail={mail} />
            </div>
        </div>
    );
}
