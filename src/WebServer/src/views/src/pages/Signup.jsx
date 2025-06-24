import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";

export function Signup() {
    const [firstname, setFirstname] = useState("");
    const [surname, setSurname] = useState("");
    const [email, setEmail] = useState("");
    const [picture, setPicture] = useState(null);
    const [password, setPassword] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [formError, setFormError] = useState("");

    const { darkTheme } = useTheme();

    const navigation = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(password)) {
            setPasswordError(
                "Password must be at least 8 characters long and include both letters and numbers."
            );
            return;
        } else {
            setPasswordError("");
        }

        const fullname = `${firstname} ${surname}`.trim();

        const formData = new FormData();
        formData.append("fullname", fullname);
        formData.append("email", email);
        formData.append("password", password);
        formData.append("darkTheme", darkTheme);
        if (picture) {
            formData.append("picture", picture);
        }

        const response = await fetch("/api/users", {
            method: "POST",
            body: formData,
            credentials: "include",
        });
        if (response.ok) {
            navigation("/signin");
        } else {
            const errorData = await response.json();
            if (errorData.error) {
                setPasswordError("");
                setFormError(
                    errorData.error || "An error occurred. Please try again."
                );
            } else {
                setPasswordError("");
                setFormError("An error occurred. Please try again.");
            }
        }
    };

    return (
        <div
            className={`min-vh-100 w-100 d-flex justify-content-center align-items-center ${
                darkTheme ? "bg-black text-white" : "bg-light text-dark"
            }`}
        >
            <Link
                to="/home"
                className={`position-absolute top-0 start-0 m-3 btn d-flex align-items-center ${
                    darkTheme ? "btn-primary" : "btn-outline-primary"
                }`}
            >
                <span className="material-symbols-rounded">arrow_back</span>
                Home
            </Link>
            <div className="container d-flex justify-content-center align-items-center">
                <div
                    className={`card p-4 rounded-4 shadow ${
                        darkTheme ? "bg-dark text-white" : "bg-white text-dark"
                    }`}
                    role="main"
                    aria-label="Create a RakMail Account form"
                    style={{ maxWidth: "400px", width: "100%" }}
                >
                    <h2 className="text-center mb-4">
                        Create a RakMail Account
                    </h2>
                    <form onSubmit={handleSubmit}>
                        {formError && (
                            <div className="alert alert-danger py-2 text-center">
                                {formError}
                            </div>
                        )}
                        <div className="form-group mb-3">
                            <label htmlFor="firstname" className="form-label">
                                First Name
                            </label>
                            <input
                                type="text"
                                id="firstname"
                                name="firstname"
                                value={firstname}
                                onChange={(e) => setFirstname(e.target.value)}
                                required
                                className="form-control"
                                autoComplete="given-name"
                            />
                        </div>
                        <div className="form-group mb-3">
                            <label htmlFor="surname" className="form-label">
                                Surname
                            </label>
                            <input
                                type="text"
                                id="surname"
                                name="surname"
                                value={surname}
                                onChange={(e) => setSurname(e.target.value)}
                                className="form-control"
                                autoComplete="family-name"
                                required
                            />
                        </div>
                        <div className="form-group mb-3">
                            <label htmlFor="email" className="form-label">
                                Email
                            </label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="form-control"
                                autoComplete="email"
                            />
                        </div>
                        <div className="form-group mb-3">
                            <label htmlFor="picture" className="form-label">
                                Profile Picture
                            </label>
                            <input
                                type="file"
                                id="picture"
                                name="picture"
                                accept="image/*"
                                onChange={(e) => setPicture(e.target.files[0])}
                                className="form-control"
                                style={{ padding: "6px 16px", height: "40px" }}
                            />
                        </div>
                        <div className="form-group mb-3">
                            <label htmlFor="password" className="form-label">
                                Password
                            </label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className={`form-control${
                                    passwordError ? " is-invalid" : ""
                                }`}
                                autoComplete="new-password"
                            />
                            {passwordError && (
                                <div className="text-danger small" role="alert">
                                    {passwordError}
                                </div>
                            )}
                        </div>
                        <button
                            type="submit"
                            className={`btn w-100 fw-bold ${
                                darkTheme
                                    ? "btn-primary"
                                    : "btn-outline-primary"
                            }`}
                        >
                            Sign Up
                        </button>
                    </form>
                    <div className="text-center mt-3">
                        <small>
                            Already have an account?{" "}
                            <Link
                                to="/signin"
                                className={`text-decoration-none ${
                                    darkTheme ? "text-white-50" : "text-primary"
                                }`}
                            >
                                Sign in
                            </Link>
                        </small>
                    </div>
                </div>
            </div>
        </div>
    );
}
