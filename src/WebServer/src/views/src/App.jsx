import { useEffect } from "react";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import TopBarButtons from "./components/TopBarButtons/TopBarButtons";
import { useAuth } from "./context/AuthContext.js";
import { useTheme } from "./context/ThemeContext.js";
import { Inbox } from "./pages/Inbox.jsx";
import { Signin } from "./pages/Signin.jsx";
import { Signup } from "./pages/Signup.jsx";
import NotSignedInAlert from "./components/NotSignedInAlert/NotSignedInAlert.jsx";

function App() {
    const { signedin } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (signedin && location.pathname !== "/inbox") {
            navigate("/inbox", { replace: true });
        }
    }, [signedin, navigate, location.pathname]);

    return (
        <>
            {!signedin && <NotSignedInAlert />}
            <TopBarButtons />
            <Routes>
                <Route path="/signin" element={<Signin />} />
                <Route path="/inbox" element={<Inbox />} />
                <Route path="/signup" element={<Signup />} />
            </Routes>
        </>
    );
}

export default App;
