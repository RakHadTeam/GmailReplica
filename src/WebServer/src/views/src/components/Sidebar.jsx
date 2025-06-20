import { useTheme } from "../context/ThemeContext.jsx";
import useLabels from "../hooks/useLabels.js";
import useMails from "../hooks/useMails.js";
import useUIs from "../hooks/useUIs.js";
import ComposeMail from "./ComposeMail.jsx";
export default function Sidebar() {
    const { darkTheme } = useTheme();
    const { mails } = useMails();
    const {
        labels,
        activeLabel,
        starredIds,
        setActiveLabel,
        binnedIds,
        spammedIds,
    } = useLabels();
    const { toggleShowCompose, showCompose, toggleLabelManager } = useUIs();
   
    return (
        <div
            className={`p-3 rounded-3 d-flex flex-column gap-2 mb-4 ${darkTheme ? "bg-dark text-light" : "bg-light text-dark"
                }`}
            style={{ width: "240px" }}
        >
            <h3 className="mb-4 fw-bold ms-4 mt-2">RakMail</h3>

            <button
                className="btn btn-primary d-flex align-items-center gap-2 rounded-pill px-3 py-2"
                onClick={toggleShowCompose}
            >
                <span className="material-symbols-rounded">edit</span>
                Compose
            </button>

            <div className="mt-2 d-flex flex-column gap-2">
                <button
                    className={`btn d-flex align-items-center gap-2 text-start ${activeLabel === "All" ? "active" : ""
                        } ${darkTheme ? "text-light" : "text-dark"}`}
                    onClick={() => setActiveLabel("All")}
                >
                    <span className="material-symbols-rounded">inbox</span>
                    Inbox
                    <span className="ms-auto">
                        {
                            mails.filter(
                                (mail) =>
                                    !mail.draft &&
                                    !binnedIds.includes(mail.id) &&
                                    !spammedIds.includes(mail.id)
                            ).length
                        }
                    </span>
                </button>

                <button
                    className={`btn d-flex align-items-center gap-2 text-start ${activeLabel === "Starred" ? "active" : ""
                        } ${darkTheme ? "text-light" : "text-dark"}`}
                    onClick={() => setActiveLabel("Starred")}
                >
                    <span className="material-symbols-rounded">star</span>
                    Starred
                    <span className="ms-auto">
                        {starredIds.filter((id) => !binnedIds.includes(id)).length}
                    </span>
                </button>

                <button
                    className={`btn d-flex align-items-center gap-2 text-start ${darkTheme ? "text-light" : "text-dark"
                        }`}
                >
                    <span className="material-symbols-rounded">schedule</span>
                    Snoozed
                </button>

                <button
                    className={`btn d-flex align-items-center gap-2 text-start ${darkTheme ? "text-light" : "text-dark"}`}
                    onClick={() => setActiveLabel("Sent")}
                >
                    <span className="material-symbols-rounded">send</span>
                    Sent
                </button>

                <button
                    className={`btn d-flex align-items-center fw-bold gap-2 text-start ${activeLabel === "Drafts" ? "active" : ""
                        } ${darkTheme ? "text-light" : "text-dark"}`}
                    onClick={() => setActiveLabel("Drafts")}
                >
                    <span className="material-symbols-rounded">draft</span>
                    Drafts
                    <span className="ms-auto">
                        {
                            mails.filter(
                                (mail) =>
                                    mail.draft && !binnedIds.includes(mail.id)
                            ).length
                        }
                    </span>
                </button>

                <button
                    className={`btn d-flex align-items-center gap-2 text-start ${darkTheme ? "text-light" : "text-dark"
                        }`}
                    onClick={() => setActiveLabel("Spam")}
                >
                    <span className="material-symbols-rounded">report</span>
                    Spam
                    <span className="ms-auto">
                        {mails.filter((mail) => spammedIds.includes(mail.id)).length}
                    </span>
                </button>

                <button
                    className={`btn d-flex align-items-center gap-2 text-start ${activeLabel === "Bin" ? "active" : ""
                        } ${darkTheme ? "text-light" : "text-dark"}`}
                    onClick={() => setActiveLabel("Bin")}
                >
                    <span className="material-symbols-rounded">delete</span>
                    Bin
                    <span className="ms-auto">
                        {mails.filter((mail) => binnedIds.includes(mail.id)).length}
                    </span>
                </button>

                <hr className="my-2" />
            </div>

            {/* LABELS SECTION */}
            <div className="mt-2 d-flex flex-column gap-2">
                <div className="d-flex justify-content-between align-items-center mb-2">
                    <span
                        className={`fs-5 fw-bold ${darkTheme ? "text-light" : "text-dark"
                            }`}
                    >
                        Labels
                    </span>
                    <button
                        className="btn btn-sm rounded-circle d-flex align-items-center justify-content-center"
                        style={{ width: "32px", height: "32px" }}
                        onClick={toggleLabelManager}
                    >
                        <span className="material-symbols-rounded">settings</span>
                    </button>
                </div>

                {labels.map((label) => {
                    if (
                        label.id === "Starred" ||
                        label.id === "Spam" ||
                        label.id === "Bin" ||
                        label.id === "Sent"
                    ) return null;

                    return (
                        <button
                            key={label.id}
                            className={`btn d-flex align-items-center gap-2 text-start ${label.id === activeLabel ? "active" : ""
                                } ${darkTheme ? "text-light" : "text-dark"}`}
                            onClick={() => setActiveLabel(label.id)}
                        >
                            <span className="material-symbols-rounded">label</span>
                            {label.name}
                        </button>
                    );
                })}
            </div>

            {showCompose && <ComposeMail />}
        </div>
    );
}
