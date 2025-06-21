import "bootstrap/dist/css/bootstrap.min.css";
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import { MailAppProvider } from "./context/MailAppContext.jsx";
import { ThemeProvider } from "./context/ThemeContext.jsx";
import { LabelProvider } from "./hooks/useLabels.js";
import { MailProvider } from "./hooks/useMails.js";
import { UIProvider } from "./hooks/useUIs.js";
import reportWebVitals from "./reportWebVitals.js";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    <React.StrictMode>
        <BrowserRouter>
            <ThemeProvider>
                <AuthProvider>
                    <UIProvider>
                        <LabelProvider>
                            <MailProvider>
                                <MailAppProvider>
                                    <App />
                                </MailAppProvider>
                            </MailProvider>
                        </LabelProvider>
                    </UIProvider>
                </AuthProvider>
            </ThemeProvider>
        </BrowserRouter>
    </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
