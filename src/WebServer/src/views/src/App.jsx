import { useContext, useEffect } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import { AuthContext } from "./context/AuthContext.jsx";
import { useTheme } from './context/ThemeContext.jsx';
import { Signin } from "./pages/Signin.jsx";
import { Main } from "./pages/Main.jsx";
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
            navigate('/signin', { replace: true });
        } else {
            navigate('/', { replace: true });
        }
    }, [signedin, loading]);

    const { theme, toggleDarkTheme } = useTheme();

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
                    style={{
                        backgroundColor: theme.primaryBtn,
                        color: "white",
                        border: "none",
                        borderRadius: "4px",
                        padding: "6px 10px",
                        cursor: "pointer",
                    }}
                >
                    Toggle Dark Mode
                </button>
            </div>
            <Routes>
                <Route path="/" element={<Main />} />
                <Route path="/signin" element={<Signin />} />
                <Route path="/signup" element={<Signup />} />
            </Routes>
        </>
    );
}

export default App;
