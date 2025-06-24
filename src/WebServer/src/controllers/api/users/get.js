import { getUserById } from "../../../services/user.service.js";

export function getUserByIdHandler(req, res) {
    const { id } = req.params;
    const user = getUserById(id);
    if (!user) {
        return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json({
        id: user.id,
        fullname: user.fullname,
        email: user.email,
        picture: user.picture,
        createdAt: user.createdAt,
    });
}
