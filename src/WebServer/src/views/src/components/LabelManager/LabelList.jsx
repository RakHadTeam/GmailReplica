import { useMailApp } from "../../context/MailAppContext.js";
import { useLabelActions } from "../../hooks/useLabelActions.js";
import { useTheme } from "../../context/ThemeContext";

export default function LabelList({ searchTerm, setError }) {
    const {
        labelState: { labels },
    } = useMailApp();

    const { deleteLabel } = useLabelActions();
    const { darkTheme } = useTheme();

    return (
        <ul className={`list-group ${darkTheme ? "bg-dark" : ""}`}>
            {labels
                .filter(
                    (label) =>
                        !["starred", "bin", "spam", "sent"].includes(
                            label.name.toLowerCase()
                        )
                )
                .filter((label) =>
                    label.name.toLowerCase().includes(searchTerm.toLowerCase())
                )
                .map(({ id, name }) => (
                    <li
                        key={id}
                        className={`list-group-item d-flex justify-content-between align-items-center ${darkTheme ? "bg-dark text-light" : "bg-light text-dark"}`}
                    >
                        {name}
                        <button
                            className={`btn btn-sm ${darkTheme ? "btn-danger" : "btn-outline-danger"}`}
                            onClick={() => deleteLabel(id)}
                        >
                            <span className="material-symbols-rounded">
                                delete
                            </span>
                        </button>
                    </li>
                ))}
        </ul>
    );
}
