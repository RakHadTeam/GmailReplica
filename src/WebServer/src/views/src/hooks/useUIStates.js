import { useEffect, useRef, useState } from "react";

export default function useUiState() {
    const [contextMenu, setContextMenu] = useState(null);
    const [showLabelMenu, setShowLabelMenu] = useState(false);
    const [selectedMails, setSelectedMails] = useState([]);
    const [activeLabel, setActiveLabel] = useState("All");
    const [openMailId, setOpenMailId] = useState(null);
    const [settingsOpen, setSettingsOpen] = useState(false);
    const [labelsOpen, setLabelsOpen] = useState(false);
    const [labelManagerOpen, setLabelManagerOpen] = useState(false);
    const menuRef = useRef();

    useEffect(() => {
        const onClick = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setContextMenu(null);
                setShowLabelMenu(false);
            }
        };
        document.addEventListener("click", onClick);
        return () => document.removeEventListener("click", onClick);
    }, []);

    const toggleSettings = () => setSettingsOpen((v) => !v);
    const toggleLabels = () => setLabelsOpen((v) => !v);
    const toggleLabelManager = () => setLabelManagerOpen((v) => !v);

    return {
        contextMenu,
        setContextMenu,
        showLabelMenu,
        setShowLabelMenu,
        selectedMails,
        setSelectedMails,
        activeLabel,
        setActiveLabel,
        openMailId,
        setOpenMailId,
        settingsOpen,
        toggleSettings,
        labelsOpen,
        toggleLabels,
        labelManagerOpen,
        toggleLabelManager,
        menuRef,
    };
}
