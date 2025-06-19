import { createContext, useContext, useEffect, useRef, useState } from "react";

const UiContext = createContext();

export const UiProvider = ({ children }) => {
    const [contextMenu, setContextMenu] = useState(null);
    const [showLabelPopup, setShowLabelPopup] = useState(false);
    const [openMailId, setOpenMailId] = useState(null);
    const [settingsOpen, setSettingsOpen] = useState(false);
    const [labelsOpen, setLabelsOpen] = useState(false);
    const [labelManagerOpen, setLabelManagerOpen] = useState(false);
    const [showCompose, setShowCompose] = useState(false);
    const menuRef = useRef();

    useEffect(() => {
        const onClick = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setContextMenu(null);
                setShowLabelPopup(false);
            }
        };
        document.addEventListener("click", onClick);
        return () => document.removeEventListener("click", onClick);
    }, []);

    const toggleSettings = () => setSettingsOpen(v => !v);
    const toggleLabels = () => setLabelsOpen(v => !v);
    const toggleLabelManager = () => setLabelManagerOpen(v => !v);
    const toggleShowCompose = (forceState = null) => {
        setShowCompose(prev => {
            const next = forceState !== null ? forceState : !prev;
            return next;
        });
    };

    return (
        <UiContext.Provider value={{
            contextMenu, setContextMenu,
            showLabelPopup, setShowLabelPopup,
            openMailId, setOpenMailId,
            settingsOpen, toggleSettings,
            labelsOpen, toggleLabels,
            labelManagerOpen, toggleLabelManager,
            showCompose,
            toggleShowCompose,
            menuRef
        }}>
            {children}
        </UiContext.Provider>
    );
};

export default function useUiState() {
    return useContext(UiContext);
}
