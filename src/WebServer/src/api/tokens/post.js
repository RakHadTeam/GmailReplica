import { validateCredentials } from "./tokensService.js";


export function postTokens(req, res) {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required' });
    }

    const { valid, user } = validateCredentials(username, password);

    if (!valid) {
        return res.status(400).json({ error: 'Invalid credentials' });
    }

    const token = `${user.id}-token`;

    // Respond with token
    return res.status(200).json({ token });
}