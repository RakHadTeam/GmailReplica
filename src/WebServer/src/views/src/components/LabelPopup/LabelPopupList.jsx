export default function LabelPopupList({
    labels,
    selectedMails,
    searchTerm,
    handleLabelToggleOnMailId,
}) {
    const filteredLabels = labels.filter(
        ({ name }) =>
            name.toLowerCase().includes(searchTerm.toLowerCase()) &&
            !["starred", "bin", "spam", "sent"].includes(name.toLowerCase())
    );

    const getLabelState = (labelId) => {
        const label = labels.find((l) => l.id === labelId);
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
            className="list-group list-group-flush mb-2 mx-3"
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
                        className="list-group-item d-flex align-items-center"
                        style={{ cursor: "pointer" }}
                        onClick={() => {
                            selectedMails.forEach((mail) => {
                                const hasLabel = labels
                                    .find((l) => l.id === id)
                                    ?.mails.includes(mail);
                                if (state === "some" && hasLabel) {
                                    handleLabelToggleOnMailId(id, mail);
                                } else {
                                    handleLabelToggleOnMailId(id, mail);
                                }
                            });
                        }}
                    >
                        <div className="d-flex align-items-center gap-2">
                            <span className="material-symbols-rounded">
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
