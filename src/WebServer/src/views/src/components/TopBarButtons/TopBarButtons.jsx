import { useState } from "react";
import { useAuth } from "../../context/AuthContext.js";
import { useTheme } from "../../context/ThemeContext.js";
import Settings from "../Settings/Settings.jsx";
import DarkModeButton from "./DarkModeButton.jsx";
import SettingsButton from "./SettingsButton.jsx";

export default function TopBarButtons() {
    const { toggleDarkTheme, darkTheme } = useTheme();
    const { signedin, currentUser } = useAuth();
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
            }}
        >
            {signedin && currentUser && (
                <div
                    className={`d-flex align-items-center gap-2 me-0 ${
                        darkTheme ? "bg-dark text-light" : "bg-light text-dark"
                    } p-2 rounded`}
                >
                    <span className="fw-semibold">{currentUser.fullname}</span>
                    {currentUser.picture && (
                        <img
                            src={currentUser.picture}
                            alt="Profile"
                            style={{
                                width: "40px",
                                height: "40px",
                                borderRadius: "50%",
                                objectFit: "cover",
                                backgroundColor: "white",
                            }}
                        />
                    )}
                </div>
            )}
            <DarkModeButton onClick={toggleDarkTheme} />
            {signedin && <SettingsButton onClick={toggleSettings} />}
            {settingsOpen && <Settings onClose={toggleSettings} />}
        </div>
    );
}
