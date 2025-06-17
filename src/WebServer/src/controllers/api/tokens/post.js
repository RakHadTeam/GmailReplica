import { generateToken } from "../../../core/jwt.js";
import { validateCredentials } from "../../../models/token.model.js";

export function postTokens(req, res) {
    const { email, password } = req.body;
    if (!email || !password) {
        return res
            .status(400)
            .json({ error: "Email and password are required" });
    }

    const { status, user } = validateCredentials(email, password);

    if (status != 200) {
        return res.status(status).json({ error: "Invalid credentials" });
    }

    const token = generateToken(user);

    res.cookie("token", token, {
        httpOnly: true,
        secure: false,
        sameSite: "Strict",
        maxAge: 60 * 60 * 1000
    })
        .json({ token });
}
