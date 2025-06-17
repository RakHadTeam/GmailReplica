import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext.jsx";
import { useTheme } from "../context/ThemeContext.jsx";

export function Signin() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { signedin, setSignedin, loading } = useContext(AuthContext);
    const { theme } = useTheme();

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
            } else {
                // Handle error, e.g., show an error message
                console.error("Login failed");
            }
        });
    };

    return !signedin ? (
        <div
            className="container-fluid py-5"
            style={{ backgroundColor: theme.bg, minHeight: "100vh" }}
        >
            <div className="d-flex flex-column align-items-center gap-5">
                <div
                    className="text-center"
                    style={{
                        backgroundColor: theme.highlight,
                        padding: "14px 24px",
                        borderRadius: "6px",
                        color: theme.text,
                    }}
                >
                    <h2 className="m-0">Welcome to RakMail!</h2>
                </div>
                <div
                    className="card p-4 shadow"
                    style={{
                        width: "100%",
                        maxWidth: "450px",
                        backgroundColor: theme.bg,
                        color: theme.text,
                    }}
                >
                    <h3 className="card-title text-center mb-4">Sign In</h3>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
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
                        <div className="mb-3">
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
                        <button
                            type="submit"
                            className="btn w-100"
                            style={{
                                backgroundColor: theme.primaryBtn,
                                color: theme.btnText,
                                border: "none",
                            }}
                        >
                            Sign In
                        </button>
                    </form>
                    <div className="text-center mt-3">
                        <small>
                            Don't have an account?{" "}
                            <Link
                                to="/signup"
                                className="text-decoration-none"
                                style={{ color: theme.primaryBtn }}
                            >
                                Sign up
                            </Link>
                        </small>
                    </div>
                </div>
            </div>
        </div>
    ) : (
        <div
            className="container-fluid py-5"
            style={{ backgroundColor: theme.bg, color: theme.text }}
        >
            <div
                className="d-flex justify-content-center align-items-center"
                style={{ minHeight: "60vh" }}
            >
                <div className="text-center">
                    <h2>You are already signed in!</h2>
                </div>
            </div>
        </div>
    );
}
