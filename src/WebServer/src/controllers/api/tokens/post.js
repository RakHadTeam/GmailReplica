import { validateCredentials } from "../../../models/token.model.js";

export function postTokens(req, res) {
    const { username, password } = req.body;
    if (!username || !password) {
        return res
            .status(400)
            .json({ error: "Username and password are required" });
    }

    const { status, user } = validateCredentials(username, password);

    if (status != 200) {
        return res.status(status).json({ error: "Invalid credentials" });
    }

    const token = `Bearer ${user.id}`;

    // Respond with token
    return res.status(status).json({ token });
}
