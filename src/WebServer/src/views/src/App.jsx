import { useContext, useEffect } from "react";
import { Route, Routes, useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "./context/AuthContext.jsx";
import { useTheme } from "./context/ThemeContext.jsx";
import { Inbox } from "./pages/Inbox.jsx";
import { Signin } from "./pages/Signin.jsx";
import { Signup } from "./pages/Signup.jsx";

function App() {
    const { signedin } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();


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
                style={{
                    position: "absolute",
                    top: 10,
                    right: 10,
                    zIndex: 9999,
                }}
            >
                <button
                    onClick={toggleDarkTheme}
                    className={darkTheme ? "btn btn-primary" : "btn btn-outline-primary"}
                >
                    {darkTheme ? "☀" : "☾"}
                </button>
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
