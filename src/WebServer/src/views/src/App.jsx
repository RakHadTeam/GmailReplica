import { useContext, useEffect } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import { AuthContext } from "./context/AuthContext.jsx";
import { useTheme } from "./context/ThemeContext.jsx";
import { Inbox } from "./pages/Inbox.jsx";
import { Signin } from "./pages/Signin.jsx";
import { Signup } from "./pages/Signup.jsx";

function App() {
    const { signedin, setSignedin, loading } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (signedin !== false) {
            setSignedin(false);
        }
    }, []);

    useEffect(() => {
        if (loading) return;
        if (!signedin) {
            navigate("/signin", { replace: true });
        } else {
            navigate("/inbox", { replace: true });
        }
    }, [signedin, loading]);

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
