import { createContext, useContext, useEffect, useState } from "react";
import defaultPicture from "../resources/default-profile-picture.svg";

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [signedin, setSignedin] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);

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

                    setCurrentUser(userData);
                }
            } catch (error) {
                console.error("Error checking login status:", error);
            }
        };
        checkLoggedin();
    }, [signedin]);

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
