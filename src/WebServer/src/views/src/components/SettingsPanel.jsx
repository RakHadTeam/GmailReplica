import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext.jsx";
import { useTheme } from "../context/ThemeContext.jsx";
import useUIs from "../hooks/useUIs.js";
import useMails from "../hooks/useMails.js";
import useLabels from "../hooks/useLabels.js";

export default function SettingsPanel() {
    const {
        fullName,
        setFullName,
        profileImage,
        setProfileImage,
        currentUser,
        setSignedin,
    } = useContext(AuthContext);
    const { toggleSettings } = useUIs();
    const { darkTheme } = useTheme();
    const { fetchMails } = useMails();
    const { fetchLabels } = useLabels();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!currentUser) return;

        const formData = new FormData();
        formData.append("fullname", fullName);
        if (profileImage) {
            formData.append("picture", profileImage);
        }

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
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <div className="d-flex align-items-center gap-2">
                        <span
                            className="material-symbols-rounded"
                            style={{ fontSize: "1.5rem" }}
                        >
                            settings
                        </span>
                        <h5 className="mb-0">Settings</h5>
                    </div>
                    <button
                        className="btn-close"
                        onClick={toggleSettings}
                    ></button>
                </div>

                {currentUser && (
                    <div className="mb-3 text-center">
                        <div
                            className="alert alert-secondary bg-opacity-10 text-center"
                            role="alert"
                        >
                            Logged in as <strong>{currentUser.fullname}</strong>
                        </div>
                        {currentUser.picture && (
                            <img
                                src={`/uploads/${currentUser.picture}`}
                                alt="Profile"
                                className="rounded-circle border border-2"
                                style={{
                                    width: "80px",
                                    height: "80px",
                                    objectFit: "cover",
                                }}
                            />
                        )}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label htmlFor="fullName" className="form-label">
                            Change Full Name
                        </label>
                        <input
                            type="text"
                            className="form-control"
                            id="fullName"
                            placeholder="New name"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                        />
                    </div>

                    <div className="mb-4">
                        <label htmlFor="profileImage" className="form-label">
                            Profile Image
                        </label>
                        <input
                            type="file"
                            className="form-control"
                            id="profileImage"
                            accept="image/*"
                            onChange={(e) => setProfileImage(e.target.files[0])}
                        />
                    </div>

                    <div className="d-grid">
                        <button
                            type="submit"
                            className="btn btn-primary w-100 mb-2"
                        >
                            Save Changes
                        </button>
                    </div>

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
                            </span>{" "}
                            Logout
                        </button>
                    </div>

                    <hr className="my-3" />
                    <div className="mb-3">
                        <label htmlFor="addUrl" className="form-label">
                            Add URL to Blacklist
                        </label>
                        <input
                            type="text"
                            className="form-control"
                            id="addUrl"
                            placeholder="https://example.com"
                            onKeyDown={async (e) => {
                                if (e.key === "Enter") {
                                    e.preventDefault();
                                    const url = e.target.value.trim();
                                    if (!url) return;
                                    try {
                                        const res = await fetch("/api/blacklist", {
                                            method: "POST",
                                            headers: {
                                                "Content-Type": "application/json",
                                            },
                                            body: JSON.stringify({ url }),
                                        });
                                        if (res.ok) {
                                            alert("URL added to blacklist!");
                                            e.target.value = "";
                                        } else {
                                            alert("Failed to add URL.");
                                        }
                                    } catch (err) {
                                        console.error(err);
                                        alert("Error adding URL.");
                                    }
                                }
                            }}
                        />
                    </div>

                    <div className="mb-3">
                        <label htmlFor="removeUrl" className="form-label">
                            Remove URL from Blacklist
                        </label>
                        <input
                            type="text"
                            className="form-control"
                            id="removeUrl"
                            placeholder="https://example.com"
                            onKeyDown={async (e) => {
                                if (e.key === "Enter") {
                                    e.preventDefault();
                                    const url = e.target.value.trim();
                                    if (!url) return;
                                    try {
                                        const res = await fetch(`/api/blacklist/${encodeURIComponent(url)}`, {
                                            method: "DELETE",
                                        });
                                        if (res.ok) {
                                            alert("URL removed from blacklist!");
                                            e.target.value = "";
                                        } else {
                                            alert("Failed to remove URL.");
                                        }
                                    } catch (err) {
                                        console.error(err);
                                        alert("Error removing URL.");
                                    }
                                }
                            }}
                        />
                    </div>
                </form>
            </div>
        </div>
    );
}
