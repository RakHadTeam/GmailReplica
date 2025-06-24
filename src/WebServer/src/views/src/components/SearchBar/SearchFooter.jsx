export default function SearchFooter({ query, onClick }) {
    return (
        <div
            className="d-flex align-items-center px-3 py-2 hover-bg"
            style={{ cursor: "pointer" }}
            onClick={onClick}
        >
            <span className="material-symbols-rounded text-secondary">
                search
            </span>
            <span className="ms-2 flex-grow-1">
                All search results for "{query}"
            </span>
            <span className="small text-muted">Press ENTER</span>
        </div>
    );
}
