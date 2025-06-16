import jwt from "jsonwebtoken";

export function getMe(req, res) {
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).json({ error: "No token provided in cookies" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        res.json({ userId: decoded.id });
    } catch (err) {
        res.status(403).json({ error: "Invalid or expired token" });
    }
}