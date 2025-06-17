import jwt from "jsonwebtoken";

export function requireAuth(req, res, next) {
    const token =
        req.cookies?.token ||
        req.headers.authorization?.split(" ")[1];

    if (!token) {
        return res.status(401).json({ error: "No token provided" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // attach user info
        next();
    } catch (err) {
        return res.status(403).json({ error: "Invalid or expired token" });
    }
}
