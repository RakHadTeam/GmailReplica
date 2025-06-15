const { generateToken } = require("../../core/jwt");
const { getUserByUsername } = require("../../models/user.model");

exports.login = (req, res) => {
    const { username, password } = req.body;

    const user = getUserByUsername(username);
    if (!user || user.password !== password) {
        return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = generateToken(user);

    res.cookie("token", token, {
        httpOnly: true,
        secure: false, // production: true
        sameSite: "Strict",
        maxAge: 60 * 60 * 1000
    })
        .json({ token });
};
