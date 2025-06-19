// src/components/MailList.jsx
import { useTheme } from "../context/ThemeContext";
import useLabels from "../hooks/useLabels.js";
import useMailHandlers from "../hooks/useMailHandlers.js";
import useMails from "../hooks/useMails.js";
import useStarHandlers from "../hooks/useStarHandlers.js";
import useUIs from "../hooks/useUIs.js";
import MailDetail from "./MailDetail.jsx";
import ComposeMail from "./ComposeMail.jsx";

export default function MailList() {
  const { mails, filteredMails, selectedMails, setSelectedMails } = useMails();
  const { setShowLabelPopup, setContextMenu, openMailId } = useUIs();
  const { starredIds } = useLabels();
  const { handleSelect, handleOpenMail, handleCloseDetail } = useMailHandlers();
  const { handleToggleStar } = useStarHandlers();
  const { darkTheme } = useTheme();

  const handleRightClick = (e, mailId) => {
    e.preventDefault();
    setContextMenu({ x: e.pageX, y: e.pageY, mailId });
    if (!selectedMails.includes(mailId)) {
      setSelectedMails([]);
      handleSelect(mailId);
    }
    setShowLabelPopup(false);
  };

  const openMail = openMailId != null
    ? mails.find(m => m.id === openMailId)
    : null;

  if (openMail && !openMail.draft) {
    return <MailDetail handleCloseDetail={handleCloseDetail} />;
  }

  return (
    <div className="w-100 position-relative">
      {openMail && openMail.draft && (
        <ComposeMail draftMail={openMail} />
      )}

      <div className={`table w-100 ${darkTheme ? "bg-dark text-white" : "bg-white text-dark"}`}>
        {filteredMails.map(mail => {
          const isSelected = selectedMails.includes(mail.id);
          return (
            <div
              key={mail.id}
              className={`d-flex align-items-center border-bottom py-2 px-3 hover-bg ${
                isSelected ? "bg-primary bg-opacity-10" : ""
              } ${darkTheme ? "bg-dark text-white" : ""}`}
              onContextMenu={e => handleRightClick(e, mail.id)}
              onClick={() => handleOpenMail(mail.id)}
            >
              <span
                className="material-symbols-rounded me-2"
                onClick={e => {
                  e.stopPropagation();
                  handleSelect(mail.id);
                }}
                style={{ fontSize: 20, cursor: "pointer" }}
              >
                {isSelected ? "check_box" : "check_box_outline_blank"}
              </span>
              <span
                className="me-3"
                onClick={e => {
                  e.stopPropagation();
                  handleToggleStar(mail.id);
                }}
                style={{
                  color: starredIds.includes(mail.id) ? "#fbbc04" : "#ccc",
                  fontSize: 20,
                  cursor: "pointer"
                }}
              >
                {starredIds.includes(mail.id) ? "★" : "☆"}
              </span>
              <div className="d-flex align-items-center flex-grow-1 overflow-hidden text-truncate">
                <div
                  className={`me-2 text-truncate ${darkTheme ? "text-white" : ""}`}
                  style={{ width: 200 }}
                >
                  {mail.recipientName || "(no recipient)"}
                </div>
                <div className={`small text-truncate ${darkTheme ? "text-white" : ""}`}>
                  <span>{mail.subject || "(no subject)"}</span>{" "}
                  <span style={{ opacity: 0.7 }}>
                    – {mail.body.slice(0, 80)}…
                  </span>
                </div>
              </div>
              <div className="text-nowrap small ms-auto">
                {new Date(mail.createdAt).toLocaleString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                  hour: "numeric",
                  minute: "2-digit",
                  hour12: true
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
