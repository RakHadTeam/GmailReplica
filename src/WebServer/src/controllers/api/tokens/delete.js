export function deleteTokens(req, res) {
    res.clearCookie("token", {
        httpOnly: true,
        secure: false,
        sameSite: "Strict",
    });
    res.status(204).send(); // 204 = No Content
}
