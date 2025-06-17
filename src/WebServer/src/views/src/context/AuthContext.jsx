import { createContext, useEffect, useState } from "react";
import { API_URL } from "../index.js";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => { 
    const [signedin, setSignedin] = useState(false);
    const [loading, setLoading] = useState(true);


    useEffect(() => {
        const checkLoggedin = async () => {
            setLoading(true);
            try {
                const response = await fetch("/api/me/", {
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json",
                    },
                });
                console.log(response)
                if (response.ok) {
                    setSignedin(true)
                }
            } catch (error) {
                console.error("Error checking login status:", error);
            } finally {
                setLoading(false);
            }
        };
        checkLoggedin();
    }, []);

    return (
        <AuthContext.Provider value={{ signedin, setSignedin, loading }}>
            {children}
        </AuthContext.Provider>
    );
};
