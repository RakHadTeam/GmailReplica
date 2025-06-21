import { useTheme } from "../../context/ThemeContext.js";
import SearchFooter from "./SearchFooter.jsx";
import SearchResultItem from "./SearchResultItem.jsx";

export default function SearchDropdown({
    items,
    onSelect,
    query,
    onFooterClick,
}) {
    const { darkTheme } = useTheme();

    return (
        <div
            className={`position-absolute w-100 shadow rounded-3 ${
                darkTheme ? "bg-dark text-white" : "bg-white text-dark"
            }`}
            style={{ zIndex: 2000, maxHeight: 400, overflow: "hidden" }}
        >
            <div style={{ maxHeight: 250, overflowY: "auto" }}>
                {items.map((mail) => (
                    <SearchResultItem
                        key={mail.id}
                        mail={mail}
                        onClick={() => onSelect(mail.id)}
                    />
                ))}
            </div>
            <div
                style={{
                    height: 1,
                    background: darkTheme ? "#555" : "#ddd",
                    margin: "0 8px",
                }}
            />
            <SearchFooter query={query} onClick={onFooterClick} />
        </div>
    );
}
