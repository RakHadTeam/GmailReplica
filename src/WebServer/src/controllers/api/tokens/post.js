import { UnauthorizedError } from "../../../core/errors/AppError.js";
import { generateToken } from "../../../core/jwt.js";
import { validateCredentials } from "../../../services/token.service.js";

export async function postTokens(req, res) {
    const { email, password } = req.body;
    if (!email || !password) {
        return res
            .status(400)
            .json({ error: "Email and password are required" });
    }

    try {
        const user = await validateCredentials(email, password);
        const token = generateToken(user);
        res.cookie("token", token, {
            httpOnly: true,
            maxAge: 1000 * 60 * 60 * 24, // 1 day
        });
        return res.status(200).json({ token });
    } catch (error) {
        if (error instanceof UnauthorizedError) {
            return res.status(401).json({ error: "Invalid email or password" });
        }
        return res.status(500).json({ error: "Internal server error" });
    }
}
