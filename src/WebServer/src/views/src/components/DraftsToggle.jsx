// src/components/DraftsToggle.jsx
import { useTheme } from "../context/ThemeContext";
import useMails from "../hooks/useMails";

export default function DraftsToggle({ active, onToggle }) {
    const { darkTheme } = useTheme();
    const { mails, setFilteredMails, isDraft, setIsDraft } = useMails();

    const handleClick = () => {
        if (active) {
            // switch back to all mail
            setIsDraft(false);
            setFilteredMails(mails);
        } else {
            // show only drafts
            setIsDraft(true);
            setFilteredMails(mails.filter(m => m.draft));
        }
        onToggle(!active);
    };

    const baseClasses = "btn me-2";
    const variant = active
        ? "btn-primary"
        : darkTheme
            ? "btn-outline-light"
            : "btn-outline-primary";

    return (
        <button className={`${baseClasses} ${variant}`} onClick={handleClick}>
            {active ? "Showing Drafts" : "All Mail"}
        </button>
    );
}
