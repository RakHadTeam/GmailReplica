import { useTheme } from "../../context/ThemeContext";

export default function SettingsForm({
    fullName,
    setFullName,
    setProfileImage,
    onSubmit,
}) {
    const { darkTheme } = useTheme();

    return (
        <form
            onSubmit={onSubmit}
            className={darkTheme ? "text-light" : "text-dark"}
        >
            <div className="mb-3">
                <label htmlFor="fullName" className="form-label">
                    Change Full Name
                </label>
                <input
                    type="text"
                    className={`form-control ${
                        darkTheme ? "bg-dark text-light border-secondary" : ""
                    }`}
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
                    className={`form-control ${
                        darkTheme ? "bg-dark text-light border-secondary" : ""
                    }`}
                    id="profileImage"
                    accept="image/*"
                    onChange={(e) => setProfileImage(e.target.files[0])}
                />
            </div>

            <div className="d-grid">
                <button
                    type="submit"
                    className={`btn ${
                        darkTheme ? "btn-primary" : "btn-outline-primary"
                    } w-100 mb-0`}
                >
                    Save Changes
                </button>
            </div>
        </form>
    );
}
