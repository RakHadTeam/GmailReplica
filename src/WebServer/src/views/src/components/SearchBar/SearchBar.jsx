import { useEffect, useRef, useState } from "react";
import { useMailApp } from "../../context/MailAppContext.js";
import SearchDropdown from "./SearchDropdown.jsx";
import SearchInput from "./SearchInput.jsx";

export default function SearchBar({
    searchQuery,
    setSearchQuery,
    setOpenMail,
}) {
    const {
        mailState: { mails },
    } = useMailApp();
    const [showMenu, setShowMenu] = useState(false);
    const boxRef = useRef();

    const searchResults = mails.filter(
        (m) =>
            m.subject?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            m.body?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    useEffect(() => {
        const handler = (e) => {
            if (!boxRef.current?.contains(e.target)) setShowMenu(false);
        };
        window.addEventListener("mousedown", handler);
        return () => window.removeEventListener("mousedown", handler);
    }, []);

    const clear = () => {
        setSearchQuery("");
        setShowMenu(false);
    };

    const onKeyDown = (e) => {
        if (e.key === "Enter") {
            setShowMenu(false);
        }
    };

    // merge enriched data from context
    const displayItems = searchResults.map(
        (raw) => mails.find((m) => m.id === raw.id) || raw
    );

    return (
        <div className="position-relative w-50" ref={boxRef}>
            <SearchInput
                value={searchQuery}
                onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setShowMenu(true);
                }}
                onClear={clear}
                onKeyDown={onKeyDown}
                onFocus={() => setShowMenu(true)}
            />

            {showMenu && (
                <SearchDropdown
                    items={displayItems}
                    onSelect={(id) => {
                        setOpenMail(mails.find((m) => m.id === id) || null);
                        clear();
                    }}
                    query={searchQuery}
                    onFooterClick={() => setShowMenu(false)}
                />
            )}
        </div>
    );
}
