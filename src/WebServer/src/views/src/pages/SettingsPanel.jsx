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
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <div className="d-flex align-items-center gap-2">
                        <span style={{ fontSize: "1.5rem" }}>⚙️</span>
                        <h5 className="mb-0">Settings</h5>
                    </div>
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

                    <div className="mb-4">
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

                    <div className="d-grid">
                        <button type="submit" className="btn btn-primary mb-2">
                            Save Changes
                        </button>
                    </div>

                    <hr className="my-3" />

                    <div className="d-grid">
                        <button type="button" className="btn btn-light border text-danger" onClick={() => {}}>
                            🔓 Logout
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
