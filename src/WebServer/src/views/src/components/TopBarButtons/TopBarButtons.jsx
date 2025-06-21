import { useState } from "react";
import { useAuth } from "../../context/AuthContext.js";
import { useTheme } from "../../context/ThemeContext.js";
import Settings from "../Settings/Settings.jsx";
import SettingsButton from "./SettingsButton.jsx";
import DarkModeButton from "./DarkModeButton.jsx";

export default function TopBarButtons() {
    const { toggleDarkTheme } = useTheme();
    const { signedin } = useAuth();
    const [settingsOpen, setSettingsOpen] = useState(false);

    const toggleSettings = () => {
        setSettingsOpen((prev) => !prev);
    };

    return (
        <div
            className="d-flex gap-2 align-items-center"
            style={{
                position: "absolute",
                top: 10,
                right: 10,
                zIndex: 9999,
            }}
        >
            <DarkModeButton onClick={toggleDarkTheme} />
            {signedin && <SettingsButton onClick={toggleSettings} />}
            {settingsOpen && <Settings onClose={toggleSettings} />}
        </div>
    );
}
