const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "super-secret-key";

function generateToken(user) {
    const payload = {
        id: user.id,
        email: user.email
    };

    return jwt.sign(payload, JWT_SECRET, { expiresIn: "1h" });
}

module.exports = {
    generateToken
};