import { useTheme } from "../../context/ThemeContext";

export default function LabelPopupSearch({ searchTerm, setSearchTerm }) {
    const { darkTheme } = useTheme();
    return (
        <>
            {darkTheme && (
                <label
                    className={`ms-3 mt-2 small ${
                        darkTheme ? "text-white" : "text-dark"
                    }`}
                >
                    Search Labels
                </label>
            )}
            <div className="input-group input-group-sm mb-2 mx-3 mt-3">
                <span className="input-group-text bg-transparent border-end-0">
                    <span
                        className="material-symbols-rounded"
                        style={{ color: darkTheme ? "white" : "black" }}
                    >
                        search
                    </span>
                </span>
                <input
                    id="label-search-input"
                    type="text"
                    className={`form-control border-start-0 ${
                        darkTheme ? "bg-dark text-white placeholder-white" : ""
                    }`}
                    style={{ maxWidth: "246px" }}
                    placeholder="Search labels"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
        </>
    );
}
