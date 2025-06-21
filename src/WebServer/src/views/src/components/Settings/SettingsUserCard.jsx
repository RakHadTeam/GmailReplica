export default function SettingsUserCard({ user }) {
    if (!user) return null;
    return (
        <div className="mb-3 text-center">
            <div className="alert alert-secondary bg-opacity-10 text-center" role="alert">
                Logged in as <strong>{user.fullname}</strong>
            </div>
            {user.picture && (
                <img
                    src={`/uploads/${user.picture}`}
                    alt="Profile"
                    className="rounded-circle border border-2"
                    style={{ width: 80, height: 80, objectFit: "cover" }}
                />
            )}
        </div>
    );
}
