import { useTheme } from "../context/ThemeContext";

export default function MailList({
    mails,
    selectedMails,
    handleSelect,
    handleRightClick,
    handleOpenMail,
    handleToggleStar,
    starredIds,
}) {
    const { darkTheme } = useTheme();
    return (
        <div className="w-100">
            <div className={`table w-100 ${darkTheme ? "bg-dark text-white" : "bg-white text-dark"}`}>
                {mails.map((mail) => {
                    const isSelected = selectedMails.includes(mail.id);
                    return (
                        <div
                            key={mail.id}
                            className={`d-flex align-items-center border-bottom py-2 px-3 hover-bg ${isSelected ? 'bg-primary bg-opacity-10' : ''} ${darkTheme ? "bg-dark text-white" : ""}`}
                            onContextMenu={(e) => handleRightClick(e, mail.id)}
                            onClick={() => handleOpenMail(mail.id)}
                        >
                            <span
                                className="material-symbols-rounded me-2"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleSelect(mail.id);
                                }}
                                style={{ fontSize: "20px", cursor: "pointer" }}
                            >
                                {selectedMails.includes(mail.id)
                                    ? "check_box"
                                    : "check_box_outline_blank"}
                            </span>
                            <span
                                className="me-3"
                                style={{
                                    color: starredIds.includes(mail.id)
                                        ? "#fbbc04"
                                        : "#ccc",
                                    fontSize: "20px",
                                    cursor: "pointer",
                                }}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleToggleStar(mail.id);
                                }}
                            >
                                {starredIds.includes(mail.id) ? "★" : "☆"}
                            </span>
                            <div className="d-flex align-items-center flex-grow-1 overflow-hidden text-truncate">
                                <div
                                    className={`me-2 text-truncate ${darkTheme ? "text-white" : ""}`}
                                    style={{ width: "200px", background: "none" }}
                                >
                                    {mail.recipientName}
                                </div>
                                <div
                                    className={`small text-truncate ${darkTheme ? "text-white" : ""}`}
                                    style={{ background: "none" }}
                                >
                                    {mail.body.slice(0, 100)}…
                                </div>
                            </div>
                            <div className="text-nowrap small ms-auto">
                                {new Date(mail.createdAt).toLocaleString("en-US", {
                                    month: "short",
                                    day: "numeric",
                                    year: "numeric",
                                    hour: "numeric",
                                    minute: "2-digit",
                                    hour12: true,
                                })}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
