import StatusCode from "../../../core/StatusCode";

export function deleteTokens(req, res) {
    res.clearCookie("token", {
        httpOnly: true,
        secure: false,
        sameSite: "Strict",
    });
    res.status(StatusCode.NO_CONTENT).send();
}
