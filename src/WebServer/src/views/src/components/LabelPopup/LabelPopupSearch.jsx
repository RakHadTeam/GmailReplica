export default function LabelPopupSearch({ searchTerm, setSearchTerm }) {
    return (
        <div className="input-group input-group-sm mb-2 mx-3 mt-3">
            <span className="input-group-text bg-transparent border-end-0">
                <span className="material-symbols-rounded">search</span>
            </span>
            <input
                type="text"
                className="form-control border-start-0"
                style={{ maxWidth: "220px" }}
                placeholder="Search labels"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
        </div>
    );
}
