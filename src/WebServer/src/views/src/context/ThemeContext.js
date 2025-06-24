import { createContext, useContext, useState } from "react";

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
    const [darkTheme, setDarkTheme] = useState(false);

    const toggleDarkTheme = () => {
        setDarkTheme((prevDark) => !prevDark);
    };

    return (
        <ThemeContext.Provider value={{ darkTheme, toggleDarkTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    return useContext(ThemeContext);
}
