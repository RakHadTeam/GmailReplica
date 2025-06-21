import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.js";
import { useTheme } from "../../context/ThemeContext.js";
import { useLabelActions } from "../../hooks/useLabelActions.js";
import { useMailActions } from "../../hooks/useMailActions.js";
import SettingsBlacklist from "./SettingsBlacklist";
import SettingsForm from "./SettingsForm";
import SettingsHeader from "./SettingsHeader";
import SettingsUserCard from "./SettingsUserCard";

export default function Settings({ toggleSettings }) {
    const {
        fullName,
        setFullName,
        profileImage,
        setProfileImage,
        currentUser,
        setSignedin,
    } = useAuth();
    const { darkTheme } = useTheme();
    const { fetchMails } = useMailActions();
    const { fetchLabels } = useLabelActions();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!currentUser) return;

        const formData = new FormData();
        formData.append("fullname", fullName);
        if (profileImage) formData.append("picture", profileImage);

        try {
            const res = await fetch(`/api/users/${currentUser.id}`, {
                method: "PATCH",
                body: formData,
                credentials: "include",
            });

            if (res.ok) {
                alert("Settings updated successfully!");
                fetchMails();
                fetchLabels();
                toggleSettings();
            } else {
                alert("Failed to update settings.");
            }
        } catch (err) {
            console.error("Update error:", err);
            alert("An error occurred while updating settings.");
        }
    };

    const handleLogout = async () => {
        try {
            const res = await fetch("/api/tokens", {
                method: "DELETE",
                credentials: "include",
            });

            if (res.ok) {
                setSignedin(false);
                navigate("/signin");
            } else {
                alert("Logout failed.");
            }
        } catch (err) {
            console.error("Logout error:", err);
            alert("An error occurred while logging out.");
        }
    };

    return (
        <div className="position-fixed top-0 start-0 vw-100 vh-100 d-flex align-items-center justify-content-center bg-dark bg-opacity-50 z-3">
            <div
                className={`card p-4 rounded-4 shadow w-100 ${
                    darkTheme ? "bg-dark text-white" : "bg-white text-dark"
                }`}
                style={{ maxWidth: "400px" }}
            >
                <SettingsHeader onClose={toggleSettings} />
                {currentUser && <SettingsUserCard user={currentUser} />}

                <SettingsForm
                    fullName={fullName}
                    setFullName={setFullName}
                    setProfileImage={setProfileImage}
                    onSubmit={handleSubmit}
                />

                <hr className="my-3" />

                <div className="d-grid">
                    <button
                        type="button"
                        className="btn btn-outline-danger w-100 d-flex align-items-center justify-content-center"
                        onClick={handleLogout}
                    >
                        <span
                            className="material-symbols-rounded me-2"
                            style={{ verticalAlign: "middle" }}
                        >
                            logout
                        </span>
                        Logout
                    </button>
                </div>

                <hr className="my-3" />

                <SettingsBlacklist />
            </div>
        </div>
    );
}
