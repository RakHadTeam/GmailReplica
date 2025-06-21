import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { useTheme } from "../context/ThemeContext.jsx";

export function Signin() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loginError, setLoginError] = useState(null);
    const { signedin, setSignedin } = useAuth();
    const { darkTheme } = useTheme();

    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle login logic here
        const res = fetch("/api/tokens", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify({ email, password }),
        });

        res.then((response) => {
            if (response.ok) {
                setSignedin(true);
                setLoginError(null);
            } else {
                setLoginError("Invalid email or password");
                // Handle error, e.g., show an error message
                console.error("Login failed");
            }
        });
    };

    return !signedin ? (
        <div
            className={`min-vh-100 w-100 d-flex justify-content-center align-items-center ${
                darkTheme ? "bg-black text-white" : "bg-light text-dark"
            }`}
            style={{ minHeight: "100vh", width: "100vw" }}
        >
            <div
                className={`card shadow rounded-4 px-4 py-5 ${
                    darkTheme ? "bg-dark text-white" : "bg-white text-dark"
                }`}
                style={{ width: "100%", maxWidth: "420px", border: "none" }}
            >
                <h3 className="card-title text-center mb-4 fw-bold">Sign In</h3>
                <form onSubmit={handleSubmit} className="w-100">
                    <div className="form-group mb-3">
                        <label htmlFor="email" className="form-label">
                            Email address
                        </label>
                        <input
                            type="email"
                            className="form-control"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group mb-3">
                        <label htmlFor="password" className="form-label">
                            Password
                        </label>
                        <input
                            type="password"
                            className="form-control"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    {loginError && (
                        <div className="alert alert-danger py-2 text-center">
                            {loginError}
                        </div>
                    )}
                    <button
                        type="submit"
                        className={`btn w-100 fw-bold ${
                            darkTheme ? "btn-primary" : "btn-outline-primary"
                        }`}
                    >
                        Sign In
                    </button>
                </form>
                <div className="text-center mt-3">
                    <small>
                        Don't have an account?{" "}
                        <Link
                            to="/signup"
                            className={`text-decoration-none ${
                                darkTheme ? "text-white-50" : "text-primary"
                            }`}
                        >
                            Sign up
                        </Link>
                    </small>
                </div>
            </div>
        </div>
    ) : (
        <div
            className={`min-vh-100 w-100 d-flex justify-content-center align-items-center ${
                darkTheme ? "bg-black text-white" : "bg-light text-dark"
            }`}
            style={{ minHeight: "100vh", width: "100vw" }}
        >
            <div className="text-center">
                <h2>You are already signed in!</h2>
            </div>
        </div>
    );
}
