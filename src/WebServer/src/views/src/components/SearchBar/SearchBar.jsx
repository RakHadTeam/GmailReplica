import { useEffect, useRef, useState } from "react";
import useMails from "../../hooks/useMails.js";
import useUIs from "../../hooks/useUIs.js";
import SearchInput from "./SearchInput.jsx";
import SearchDropdown from "./SearchDropdown.jsx";

export default function SearchBar() {
  const { search, searchQuery, setSearchQuery, searchResults, mails } = useMails();
  const { setOpenMailId } = useUIs();
  const [showMenu, setShowMenu] = useState(false);
  const boxRef = useRef();

  useEffect(() => {
    const id = setTimeout(() => search(searchQuery), 200);
    return () => clearTimeout(id);
  }, [searchQuery]);

  useEffect(() => {
    const handler = (e) => {
      if (!boxRef.current?.contains(e.target)) setShowMenu(false);
    };
    window.addEventListener("mousedown", handler);
    return () => window.removeEventListener("mousedown", handler);
  }, []);

  const clear = () => {
    setSearchQuery("");
    search("");
    setShowMenu(false);
  };

  const onKeyDown = (e) => {
    if (e.key === "Enter") {
      setShowMenu(false);
    }
  };

  // merge enriched data from context
  const displayItems = searchResults.map((raw) =>
    mails.find((m) => m.id === raw.id) || raw
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
          onSelect={(id) => setOpenMailId(id)}
          query={searchQuery}
          onFooterClick={() => setShowMenu(false)}
        />
      )}
    </div>
  );
}
