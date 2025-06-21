export default function SidebarHeader({ onCompose }) {
    return (
        <div className="d-flex flex-column gap-2 mb-4">
            <h3 className="fw-bold ms-4 mt-2">RakMail</h3>
            <button
                className="btn btn-primary d-flex align-items-center gap-2 rounded-pill px-3 py-2"
                onClick={onCompose}
            >
                <span className="material-symbols-rounded">edit</span>
                Compose
            </button>
        </div>
    );
}
