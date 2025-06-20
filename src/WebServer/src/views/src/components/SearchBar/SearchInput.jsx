import { useTheme } from "../../context/ThemeContext";

export default function SearchInput({
  value,
  onChange,
  onClear,
  onKeyDown,
  onFocus,
}) {
  const { darkTheme } = useTheme();

  return (
    <div
      className="input-group rounded-pill py-2 px-2 pe-2 small w-100"
      style={{
        backgroundColor: darkTheme ? "#1a2a3a" : "#e7f0fa",
        color: darkTheme ? "white" : "black",
      }}
    >
      <span className="input-group-text border-0 bg-transparent">
        <span className="material-symbols-rounded text-secondary">search</span>
      </span>
      <input
        type="text"
        className="form-control form-control-sm border-0 pe-2"
        placeholder="Search mail"
        value={value}
        onChange={onChange}
        onKeyDown={onKeyDown}
        onFocus={onFocus}
        style={{
          backgroundColor: darkTheme ? "#1a2a3a" : "#e7f0fa",
          color: darkTheme ? "white" : "black",
        }}
      />
      {value && (
        <button
          className={`btn btn-sm border-0 link-opacity-10-hover ${darkTheme ? 'text-white' : 'text-dark'}`}
          onClick={onClear}
        >
          <span className="material-symbols-rounded">close</span>
        </button>
      )}
    </div>
  );
}
