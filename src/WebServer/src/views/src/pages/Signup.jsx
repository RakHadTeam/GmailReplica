import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";

export function Signup() {
    const [fullname, setFullname] = useState("");
    const [email, setEmail] = useState("");
    const [picture, setPicture] = useState(null);
    const [password, setPassword] = useState("");
    const [passwordError, setPasswordError] = useState("");

    const { theme, changeTheme } = useTheme();

    const navigation = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        // if (!/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(password)) {
        //     setPasswordError(
        //         "Password must be at least 8 characters long and include both letters and numbers."
        //     );
        //     return;
        // } else {
        //     setPasswordError("");
        // }

        const formData = new FormData();
        formData.append("fullname", fullname);
        formData.append("email", email);
        formData.append("password", password);
        formData.append("theme", theme.name);
        if (picture) {
            formData.append("picture", picture);
        }

        fetch("/api/users", {
            method: "POST",
            body: formData,
            credentials: "include",
        })
            .then((response) => {
                if (response.ok) {
                    console.log("Signup successful");
                    // redirect to sign-in page or show success message
                    navigation("/signin");
                } else {
                    console.error("Signup failed");
                }
            })
            .catch((error) => {
                console.error("Error during signup:", error);
            });
    };

    return (
        <div
            className="container-fluid py-5"
            style={{ backgroundColor: theme.bg, minHeight: "100vh" }}
        >
            <div className="d-flex flex-column align-items-center gap-5">
                <div
                    className="text-center"
                    style={{
                        backgroundColor: theme.highlight,
                        padding: "16px 24px",
                        borderRadius: "6px",
                        color: theme.text,
                    }}
                >
                    <h2 className="m-0">Join RakMail!</h2>
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
                    <h3 className="card-title text-center mb-4">Sign Up</h3>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label htmlFor="fullname" className="form-label">
                                Full Name
                            </label>
                            <input
                                type="text"
                                className="form-control"
                                id="fullname"
                                value={fullname}
                                onChange={(e) => setFullname(e.target.value)}
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="email" className="form-label">
                                Email
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
                            <label htmlFor="picture" className="form-label">
                                Profile Picture
                            </label>
                            <input
                                type="file"
                                className="form-control"
                                id="picture"
                                accept="image/*"
                                onChange={(e) => setPicture(e.target.files[0])}
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="password" className="form-label">
                                Password
                            </label>
                            <input
                                type="password"
                                className={`form-control ${
                                    passwordError ? "is-invalid" : ""
                                }`}
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            {passwordError && (
                                <div
                                    className="invalid-feedback"
                                    style={{ color: theme.primaryBtn }}
                                >
                                    {passwordError}
                                </div>
                            )}
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
                            Sign Up
                        </button>
                    </form>
                    <div className="text-center mt-3">
                        <label className="form-label me-2">Choose Theme:</label>
                        <select
                            onChange={(e) => changeTheme(e.target.value)}
                            value={
                                theme.name.includes("dark_")
                                    ? theme.name.slice(5)
                                    : theme.name
                            }
                            className="form-select w-auto d-inline-block"
                        >
                            <option value="green">Green</option>
                            <option value="purple">Purple</option>
                            <option value="blue">Blue</option>
                            <option value="yellow">Yellow</option>
                        </select>
                    </div>
                    <div className="text-center mt-2">
                        <small>
                            Already have an account?{" "}
                            <Link
                                to="/signin"
                                className="text-decoration-none"
                                style={{ color: theme.primaryBtn }}
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
