import { Link } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";

export default function Home() {
    const { darkTheme } = useTheme();

    return (
        <div
            className={`min-vh-100 d-flex flex-column ${
                darkTheme ? "bg-dark text-light" : "bg-light text-dark"
            }`}
        >
            <header className="d-flex justify-content-start align-items-center p-3">
                <Link to="/signin" className="btn btn-outline-primary d-flex align-items-center gap-1">
                    <span className="material-symbols-rounded">login</span>
                    Sign In
                </Link>
            </header>
            <main className="flex-grow-1 d-flex flex-column justify-content-center align-items-center text-center px-3">
                <h1 className="display-4 mb-3">Welcome to RakMail</h1>
                <p className="lead mb-4">
                    Your easy and elegant solution for modern email management.
                </p>
                <Link to="/signup" className="btn btn-primary btn-lg">
                    Get Started
                </Link>
            </main>
        </div>
    );
}