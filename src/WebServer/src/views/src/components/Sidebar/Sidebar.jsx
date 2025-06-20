import { useTheme } from "../../context/ThemeContext.jsx";
import useLabels from "../../hooks/useLabels.js";
import useMails from "../../hooks/useMails.js";
import useUIs from "../../hooks/useUIs.js";
import ComposeMail from "../ComposeMail/ComposeMail.jsx";
import SidebarHeader from "./SidebarHeader.jsx";
import SidebarLabelSection from "./SidebarLabelSection.jsx";
import SidebarNavigation from "./SidebarNavigation.jsx";

export default function Sidebar() {
    const { darkTheme } = useTheme();
    const { mails, setSelectedMails } = useMails();
    const labelState = useLabels();
    const { showCompose, toggleShowCompose, toggleLabelManager } = useUIs();

    const selectActiveLabel = (labelId) => {
        labelState.setActiveLabel(labelId);
        setSelectedMails([]);
    }

    return (
        <div
            className={`p-3 rounded-3 d-flex flex-column gap-2 mb-4 ${
                darkTheme ? "bg-dark text-light" : "bg-light text-dark"
            }`}
            style={{ width: "240px" }}
        >
            <SidebarHeader onCompose={toggleShowCompose} />

            <SidebarNavigation
                mails={mails}
                labelsState={labelState}
                setActiveLabel={selectActiveLabel}
            />

            <SidebarLabelSection
                labels={labelState.labels}
                activeLabel={labelState.activeLabel}
                onSelectLabel={selectActiveLabel}
                onManageLabels={toggleLabelManager}
            />

            {showCompose && <ComposeMail />}
        </div>
    );
}
