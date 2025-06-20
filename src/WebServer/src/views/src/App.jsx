import { useContext, useEffect, useState } from "react";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "./context/AuthContext.jsx";
import { useTheme } from "./context/ThemeContext.jsx";
import { Inbox } from "./pages/Inbox.jsx";
import { Signin } from "./pages/Signin.jsx";
import { Signup } from "./pages/Signup.jsx";
import useUIs from "./hooks/useUIs.js";

function App() {
    const { signedin } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();
    const { toggleSettings } = useUIs();

    useEffect(() => {
        if (
            !signedin &&
            location.pathname !== "/signup" &&
            location.pathname !== "/signin"
        ) {
            navigate("/signin", { replace: true });
        }
        if (signedin && location.pathname !== "/inbox") {
            navigate("/inbox", { replace: true });
        }
    }, [signedin, navigate, location.pathname]);

    const { darkTheme, toggleDarkTheme } = useTheme();

    return (
        <>
            <div
                className="d-flex gap-2 align-items-center"
                style={{
                    position: "absolute",
                    top: 10,
                    right: 10,
                    zIndex: 9999,
                }}
            >
                <button
                    onClick={toggleDarkTheme}
                    className={`btn btn-sm rounded-circle d-flex align-items-center justify-content-center ${
                        darkTheme ? "btn-primary" : "btn-outline-primary"
                    }`}
                    style={{ width: "40px", height: "40px" }}
                >
                    <span className="material-symbols-rounded">
                        {darkTheme ? "light_mode" : "dark_mode"}
                    </span>
                </button>
                {signedin && (
                    <button
                        className={`btn btn-sm rounded-circle d-flex align-items-center justify-content-center ${
                            darkTheme ? "btn-secondary" : "btn-outline-secondary"
                        }`}
                        style={{ width: "40px", height: "40px" }}
                        onClick={() => {
                            toggleSettings();
                            console.log("Settings clicked");
                        }}
                    >
                        <span className="material-symbols-rounded">settings</span>
                    </button>
                )}
            </div>
            <Routes>
                <Route path="/" element={<Inbox />} />
                <Route path="/signin" element={<Signin />} />
                <Route path="/inbox" element={<Inbox />} />
                <Route path="/signup" element={<Signup />} />
            </Routes>
        </>
    );
}

export default App;
