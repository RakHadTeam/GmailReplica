import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [signedin, setSignedin] = useState(false);
    const [fullName, setFullName] = useState("");
    const [profileImage, setProfileImage] = useState(null);
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
                    setCurrentUser(userData);
                    setFullName(userData.fullname);
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
                fullName,
                setFullName,
                profileImage,
                setProfileImage,
                currentUser,
                setCurrentUser,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
