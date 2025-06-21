import { useMailApp } from "../../context/MailAppContext.js";
import { useLabelActions } from "../../hooks/useLabelActions.js";
import { useTheme } from "../../context/ThemeContext.js";

export default function LabelPopupList({ searchTerm }) {
    const { toggleLabel, getLabel } = useLabelActions();
    const {
        uiState: { selectedIds: selectedMails },
        labelState: { labels },
    } = useMailApp();
    const { darkTheme } = useTheme();

    const filteredLabels = labels.filter(
        ({ name }) =>
            name.toLowerCase().includes(searchTerm.toLowerCase()) &&
            !["starred", "bin", "spam", "sent"].includes(name.toLowerCase())
    );

    const getLabelState = (labelId) => {
        const label = getLabel(labelId);
        if (!label) return "none";
        const withLabel = selectedMails.filter((mail) =>
            label.mails.includes(mail)
        ).length;

        if (withLabel === selectedMails.length) return "all";
        if (withLabel > 0) return "some";
        return "none";
    };

    return (
        <div
            className={`list-group list-group-flush mb-2 mx-3 ${darkTheme ? "bg-dark text-light" : "bg-white text-dark"}`}
            style={{ maxHeight: "250px", overflowY: "auto" }}
        >
            {filteredLabels.map(({ id, name }) => {
                const state = getLabelState(id);
                let icon = "check_box_outline_blank";
                if (state === "all") icon = "check_box";
                else if (state === "some") icon = "indeterminate_check_box";

                return (
                    <label
                        key={id}
                        className={`list-group-item d-flex align-items-center ${darkTheme ? "bg-dark text-light" : "bg-white text-dark"}`}
                        style={{ cursor: "pointer" }}
                        onClick={() => {
                            selectedMails.forEach((mail) => {
                                if (state === "some") {
                                    toggleLabel(id, mail, false);
                                } else {
                                    toggleLabel(id, mail);
                                }
                            });
                        }}
                    >
                        <div className="d-flex align-items-center gap-2">
                            <span
                                className="material-symbols-rounded"
                                style={{ color: darkTheme ? "white" : "black" }}
                            >
                                {icon}
                            </span>
                            {name}
                        </div>
                    </label>
                );
            })}
        </div>
    );
}
