import { useTheme } from "../context/ThemeContext.jsx";
import useLabels from "../hooks/useLabels.js";
import useMails from "../hooks/useMails.js";
import useUIs from "../hooks/useUIs.js";
import ComposeMail from "./ComposeMail.jsx";

export default function Sidebar() {
    const { darkTheme } = useTheme();
    const { mails, setFilteredMails } = useMails();
    const { labels, setActiveLabel } = useLabels();
    const { toggleShowCompose, showCompose, toggleLabelManager } = useUIs();
    return (
        <div
            className={`p-3 rounded-3 d-flex flex-column gap-2 mb-4 ${
                darkTheme ? "bg-dark text-white" : "bg-light text-dark"
            }`}
            style={{ width: "240px", minHeight: "100vh" }}
        >
            <h3 className="mb-4 fw-bold mt-2">RakMail</h3>

            <button
                className="btn btn-primary d-flex align-items-center gap-2 rounded-pill px-3 py-2"
                onClick={toggleShowCompose}
            >
                <span className="material-symbols-rounded">edit</span>
                Compose
            </button>

            <div className="mt-2 d-flex flex-column gap-2">
                <button
                    className="btn d-flex align-items-center gap-2 text-start"
                    onClick={() => setActiveLabel("All")}
                >
                    <span className="material-symbols-rounded">inbox</span>
                    Inbox
                </button>
                <button
                    className="btn d-flex align-items-center gap-2 text-start"
                    onClick={() => setActiveLabel("Starred")}
                >
                    <span className="material-symbols-rounded">star</span>
                    Starred
                </button>
                <button className="btn d-flex align-items-center gap-2 text-start">
                    <span className="material-symbols-rounded">schedule</span>
                    Snoozed
                </button>
                <button className="btn d-flex align-items-center gap-2 text-start">
                    <span className="material-symbols-rounded">send</span>
                    Sent
                </button>
                <button
                    className="btn d-flex align-items-center gap-2 text-start fw-bold"
                    onClick={() =>
                        setFilteredMails(mails.filter((mail) => mail.draft))
                    }
                >
                    <span className="material-symbols-rounded">draft</span>
                    Drafts <span className="ms-auto">1</span>
                </button>
                <button className="btn d-flex align-items-center gap-2 text-start">
                    <span className="material-symbols-rounded">report</span>
                    Spam
                    <span className="ms-auto">3</span>
                </button>
                <button
                    className="btn d-flex align-items-center gap-2 text-start"
                    onClick={() => setActiveLabel("Bin")}
                >
                    <span className="material-symbols-rounded">delete</span>
                    Bin
                </button>
                <hr className="my-2" />
            </div>

            <div className="mt-2 d-flex flex-column gap-2">
                <div className="d-flex justify-content-between align-items-center mb-2">
                    <span className="fs-5 fw-bold">Labels</span>
                    <button
                        className="btn btn-sm rounded-circle d-flex align-items-center justify-content-center"
                        style={{ width: "32px", height: "32px" }}
                        onClick={toggleLabelManager}
                    >
                        <span className="material-symbols-rounded">
                            settings
                        </span>
                    </button>
                </div>
                {labels.map((label) => {
                    if (label.name === "Starred") return null; // Skip Starred label as it's already shown above
                    if (label.name === "Bin") return null; // Skip Bin label as it's not needed here
                    return (
                        <button
                            key={label.name}
                            className="btn d-flex align-items-center gap-2 text-start"
                            onClick={() =>
                                setFilteredMails(
                                    mails.filter((mail) =>
                                        label.mails.includes(mail.id)
                                    )
                                )
                            }
                        >
                            <span className="material-symbols-rounded">
                                label
                            </span>
                            {label.name}
                        </button>
                    );
                })}
            </div>
            {showCompose && <ComposeMail />}
        </div>
    );
}
