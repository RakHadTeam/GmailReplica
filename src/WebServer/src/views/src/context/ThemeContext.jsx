import { createContext, useContext, useState } from "react";

export const ThemeContext = createContext();

const themes = {
    light: {
        name: "light",
        dark: false,
        bg: "#f0fdf4",
        card: "#ffffff",
        highlight: "#dcfce7",
        primaryBtn: "#198754",
        secondaryBtn: "#28a745",
        text: "#14532d",
        btnText: "#ffffff",
        border: "#b6e2cc",
        inputBg: "#e9fdf2"
    },
    dark: {
        name: "dark",
        dark: true,
        bg: "#0e1d13",
        card: "#1a2f21",
        highlight: "#23402d",
        primaryBtn: "#3cb371",
        secondaryBtn: "#66bb6a",
        text: "#c8e6c9",
        btnText: "#1a2f21",
        border: "#447a5d",
        inputBg: "#1e3325"
    }
};

export function ThemeProvider({ children }) {
    const [darkTheme, setDarkTheme] = useState(false);

    const toggleDarkTheme = () => {
        setDarkTheme((prevDark) => !prevDark);
        
    };

    const theme = darkTheme ? themes.dark : themes.light;

    return (
        <ThemeContext.Provider
            value={{ theme, darkTheme, toggleDarkTheme }}
        >
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    return useContext(ThemeContext);
}
