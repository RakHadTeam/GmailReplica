export default function SettingsForm({
    fullName,
    setFullName,
    setProfileImage,
    onSubmit,
}) {
    return (
        <form onSubmit={onSubmit}>
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
                <button type="submit" className="btn btn-primary w-100 mb-0">
                    Save Changes
                </button>
            </div>
        </form>
    );
}
