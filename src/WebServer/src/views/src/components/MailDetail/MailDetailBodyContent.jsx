import { useTheme } from "../../context/ThemeContext.jsx";

export default function MailBodyContent({ mail }) {
    const { darkTheme } = useTheme();

    return (
        <div
            className={`pt-3`}
            style={{
                marginLeft: "4.5rem",
            }}
        >
            <div>{mail.body ?? ""}</div>
        </div>
    );
}
