import { useState } from "react";
import { useMailApp } from "../../context/MailAppContext.js";
import { useTheme } from "../../context/ThemeContext.js";
import ComposeMail from "../ComposeMail/ComposeMail.jsx";
import SidebarHeader from "./SidebarHeader.jsx";
import SidebarLabelSection from "./SidebarLabelSection.jsx";
import SidebarNavigation from "./SidebarNavigation.jsx";

export default function Sidebar({ toggleLabelManager }) {
    const { darkTheme } = useTheme();
    const {
        uiState: { setSelectedIds, setActiveLabel },
    } = useMailApp();

    const [showCompose, setShowCompose] = useState(false);

    const toggleCompose = () => {
        setShowCompose((prev) => !prev);
    };

    const selectActiveLabel = (labelId) => {
        setActiveLabel(labelId);
        setSelectedIds([]);
    };

    return (
        <div
            className={`p-3 rounded-3 d-flex flex-column gap-2 mb-4 ${
                darkTheme ? "bg-dark text-light" : "bg-light text-dark"
            }`}
            style={{ width: "240px" }}
        >
            <SidebarHeader onCompose={toggleCompose} />

            <SidebarNavigation setActiveLabel={selectActiveLabel} />

            <SidebarLabelSection
                onSelectLabel={selectActiveLabel}
                onManageLabels={toggleLabelManager}
            />

            {showCompose && <ComposeMail handleCloseCompose={toggleCompose} />}
        </div>
    );
}
