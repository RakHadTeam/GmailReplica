import { createContext, useContext, useEffect, useState } from "react";
import defaultPicture from "../resources/default-profile-picture.svg";
import { useTheme } from "./ThemeContext.js";

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [signedin, setSignedin] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);

    const { darkTheme, setDarkTheme } = useTheme();

    useEffect(() => {
        const checkLoggedin = async () => {
            try {
                const response = await fetch("/api/me/", {
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json",
                    },
                });
                if (response.ok) {
                    setSignedin(true);
                    const { userId } = await response.json();
                    const userRes = await fetch(`/api/users/${userId}`, {
                        method: "GET",
                        credentials: "include",
                    });
                    if (!userRes.ok)
                        throw new Error("Failed to fetch user data");
                    const userData = await userRes.json();

                    userData.picture = userData.picture ?? defaultPicture;
                    console.log("Setting dark theme based on user preference:", userData.darkTheme);
                    if (userData.darkTheme != undefined) {
                        setDarkTheme(userData.darkTheme === "true" || userData.darkTheme === true);
                    }

                    setCurrentUser(userData);
                }
            } catch (error) {
                console.error("Error checking login status:", error);
            }
        };
        checkLoggedin();
    }, [signedin]);

    useEffect(() => {
        if (!currentUser || currentUser.id === undefined || !signedin) return;

        const updateTheme = async () => {
            try {
                await fetch(`/api/users/${currentUser.id}`, {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    credentials: "include",
                    body: JSON.stringify({ darkTheme }),
                });
            } catch (err) {
                console.error("Failed to update dark theme preference:", err);
            }
        };

        updateTheme();
    }, [darkTheme]);

    return (
        <AuthContext.Provider
            value={{
                signedin,
                setSignedin,
                currentUser,
                setCurrentUser,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
