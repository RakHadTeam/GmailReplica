import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function NotSignedInAlert() {
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const timeout = setTimeout(() => {
            if (
                location.pathname !== "/signin" &&
                location.pathname !== "/signup" &&
                location.pathname !== "/home"
            ) {
                navigate("/home");
            }
        }, 3000);

        return () => clearTimeout(timeout);
    }, [navigate, location.pathname]);

    if (location.pathname === "/signin" || location.pathname === "/signup") {
        return null;
    }

    return (
        <div
            className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
            style={{
                backgroundColor: "rgba(0, 0, 0, 0.5)",
                zIndex: 1050,
            }}
        >
            <div
                className="alert alert-warning text-center position-relative"
                style={{ maxWidth: "500px", width: "100%" }}
            >
                <button
                    type="button"
                    className="btn-close position-absolute top-0 end-0 m-2"
                    aria-label="Close"
                    onClick={() => navigate("/home")}
                ></button>
                <h4>You are not signed in or Token expired</h4>
                <p>You will be redirected to the home page shortly.</p>
                <button
                    className="btn btn-primary mt-3"
                    onClick={() => navigate("/home")}
                >
                    Go to Home Now
                </button>
            </div>
        </div>
    );
}
