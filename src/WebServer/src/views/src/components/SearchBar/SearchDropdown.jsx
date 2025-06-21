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

    const style = `
    .dark-scrollbar .scroll-container::-webkit-scrollbar {
      width: 8px;
    }

    .dark-scrollbar .scroll-container::-webkit-scrollbar-thumb {
      background-color: #666;
      border-radius: 4px;
    }

    .dark-scrollbar .scroll-container::-webkit-scrollbar-track {
      background-color: #222;
    }

    .dark-scrollbar .scroll-container {
      scrollbar-width: thin;
      scrollbar-color: #666 #222;
    }
  `;

    return (
        <>
            <style>{style}</style>
            <div
                className={`position-absolute w-100 shadow rounded-3 ${
                    darkTheme
                        ? "bg-dark text-white dark-scrollbar"
                        : "bg-white text-dark"
                }`}
                style={{ zIndex: 2000, maxHeight: 400, overflow: "hidden" }}
            >
                <div
                    className="scroll-container"
                    style={{ maxHeight: 250, overflowY: "auto" }}
                >
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
            </div>{" "}
        </>
    );
}
