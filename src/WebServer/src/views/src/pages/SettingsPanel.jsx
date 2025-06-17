import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext.jsx";
import { useNavigate } from "react-router-dom";

export function SettingsPanel({ onClose }) {
    const [fullName, setFullName] = useState("");
    const [profileImage, setProfileImage] = useState(null);
    const [currentUser, setCurrentUser] = useState(null);
    const { setSignedin } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await fetch("/api/me", {
                    method: "GET",
                    credentials: "include",
                });

                if (!res.ok) throw new Error("Failed to fetch /api/me");
                const { userId } = await res.json();

                const userRes = await fetch(`/api/users/${userId}`, {
                    method: "GET",
                    credentials: "include",
                });

                if (!userRes.ok) throw new Error("Failed to fetch user data");
                const userData = await userRes.json();
                setCurrentUser(userData);
                setFullName(userData.fullname); // prefill the name field
            } catch (err) {
                console.error("Error fetching user info:", err);
            }
        };

        fetchUser();
    }, []);

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
                onClose();
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
        <div
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100vw",
                height: "100vh",
                backgroundColor: "rgba(0, 0, 0, 0.5)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 1050,
            }}
        >
            <div className="bg-white p-4 rounded shadow" style={{ width: "400px" }}>
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <div className="d-flex align-items-center gap-2">
                        <span style={{ fontSize: "1.5rem" }}>⚙️</span>
                        <h5 className="mb-0">Settings</h5>
                    </div>
                    <button className="btn-close" onClick={onClose}></button>
                </div>

                {currentUser && (
                    <div className="mb-3 text-center">
                        <div className="alert alert-secondary" role="alert">
                            Logged in as <strong>{currentUser.fullname}</strong>
                        </div>
                        {currentUser.picture && (
                            <img
                                src={`/uploads/${currentUser.picture}`}
                                alt="Profile"
                                className="rounded-circle"
                                style={{ width: "80px", height: "80px", objectFit: "cover" }}
                            />
                        )}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label htmlFor="fullName" className="form-label">Change Full Name</label>
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
                        <label htmlFor="profileImage" className="form-label">Profile Image</label>
                        <input
                            type="file"
                            className="form-control"
                            id="profileImage"
                            accept="image/*"
                            onChange={(e) => setProfileImage(e.target.files[0])}
                        />
                    </div>

                    <div className="d-grid">
                        <button type="submit" className="btn btn-primary mb-2">Save Changes</button>
                    </div>

                    <hr className="my-3" />

                    <div className="d-grid">
                        <button
                            type="button"
                            className="btn btn-light border text-danger"
                            onClick={handleLogout}
                        >
                            🔓 Logout
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
