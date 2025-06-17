import React from "react";

export function SettingsPanel({ onClose }) {
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
            <div
                className="bg-white p-4 rounded shadow"
                style={{ width: "400px" }}
            >
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <h5 className="mb-0">⚙️ Settings</h5>
                    <button className="btn-close" onClick={onClose}></button>
                </div>

                <form>
                    <div className="mb-3">
                        <label htmlFor="fullName" className="form-label">
                            Change Full Name
                        </label>
                        <input
                            type="text"
                            className="form-control"
                            id="fullName"
                            placeholder="New name"
                        />
                    </div>

                    <div className="mb-3">
                        <label htmlFor="profileImage" className="form-label">
                            Profile Image
                        </label>
                        <input
                            type="file"
                            className="form-control"
                            id="profileImage"
                            accept="image/*"
                        />
                    </div>

                    <button type="submit" className="btn btn-primary w-100">
                        Save Changes
                    </button>
                </form>
            </div>
        </div>
    );
}