import { createContext, useContext, useState } from "react";

export const ThemeContext = createContext();

const themes = {
    purple: {
        name: "purple",
        dark: false,
        bg: "#f9f4fc",
        card: "#ffffff",
        highlight: "#ede6f7",
        primaryBtn: "#6f42c1",
        secondaryBtn: "#a370d6",
        text: "#4b0082",
        btnText: "#ffffff",
        border: "#d6c1f0",
        inputBg: "#f3e9fd"
    },
    dark_purple: {
        name: "dark_purple",
        dark: true,
        bg: "#121212",
        card: "#1e1e2f",
        highlight: "#2e2e4d",
        primaryBtn: "#9a6ef0",
        secondaryBtn: "#b998f7",
        text: "#f0e6ff",
        btnText: "#1e1e2f",
        border: "#3e3e5e",
        inputBg: "#2a2a3f"
    },
    green: {
        name: "green",
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
    dark_green: {
        name: "dark_green",
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
    },
    blue: {
        name: "blue",
        dark: false,
        bg: "#f0f9ff",
        card: "#ffffff",
        highlight: "#dbeafe",
        primaryBtn: "#0d6efd",
        secondaryBtn: "#3b82f6",
        text: "#1e3a8a",
        btnText: "#ffffff",
        border: "#cce4ff",
        inputBg: "#e5f3ff"
    },
    dark_blue: {
        name: "dark_blue",
        dark: true,
        bg: "#0b1624",
        card: "#1a2a40",
        highlight: "#2a3b5c",
        primaryBtn: "#3b82f6",
        secondaryBtn: "#60a5fa",
        text: "#d0e7ff",
        btnText: "#1a2a40",
        border: "#3a4e6c",
        inputBg: "#1e2f48"
    },
    yellow: {
        name: "yellow",
        dark: false,
        bg: "#fffbea",
        card: "#ffffff",
        highlight: "#fff3cd",
        primaryBtn: "#ffc107",
        secondaryBtn: "#fcd34d",
        text: "#92400e",
        btnText: "#000000",
        border: "#ffe58f",
        inputBg: "#fff8dc"
    },
    dark_yellow: {
        name: "dark_yellow",
        dark: true,
        bg: "#1c1a00",
        card: "#3b3500",
        highlight: "#4e4600",
        primaryBtn: "#f0c420",
        secondaryBtn: "#ffeb3b",
        text: "#fffde7",
        btnText: "#1c1a00",
        border: "#7e7200",
        inputBg: "#3b3500"
    },
};

export function ThemeProvider({ children }) {
    const [theme, setTheme] = useState(themes.green); // default theme
    const [darkTheme, setDarkTheme] = useState(false);

    const changeTheme = (themeName) => {
        if (themes[themeName]) {
            setTheme(themes[themeName]);
        }
    };
    const toggleDarkTheme = () => {
        setTheme((prevTheme) => {
            const isDark = prevTheme.name.startsWith("dark_");
            const baseName = isDark ? prevTheme.name.slice(5) : prevTheme.name;
            const newThemeName = isDark ? baseName : `dark_${baseName}`;
            return themes[newThemeName] || themes.purple;
        });
    };

    return (
        <ThemeContext.Provider
            value={{ theme, changeTheme, darkTheme, toggleDarkTheme }}
        >
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    return useContext(ThemeContext);
}
