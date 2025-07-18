import { useEffect } from "react";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import NotSignedInAlert from "./components/NotSignedInAlert/NotSignedInAlert.jsx";
import TopBarButtons from "./components/TopBarButtons/TopBarButtons.jsx";
import { useAuth } from "./context/AuthContext.js";
import Home from "./pages/Home.jsx";
import { Inbox } from "./pages/Inbox.jsx";
import { Signin } from "./pages/Signin.jsx";
import { Signup } from "./pages/Signup.jsx";

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
            {!signedin &&
                location.pathname !== "/signup" &&
                location.pathname !== "/signin" &&
                location.pathname !== "/home" &&
                location.pathname !== "/" && <NotSignedInAlert />}
            <TopBarButtons />
            <Routes>
                <Route path="/signin" element={<Signin />} />
                <Route path="/inbox" element={<Inbox />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/home" element={<Home />} />
                <Route path="/" element={<Home />} />
            </Routes>
        </>
    );
}

export default App;
