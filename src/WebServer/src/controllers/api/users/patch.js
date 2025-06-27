import fs from "fs";
import path from "path";
import { NotFoundError } from "../../../core/errors/AppError.js";
import { updateUserById } from "../../../services/user/updateUserById.js";

export async function patchUserByIdHandler(req, res) {
    const { id } = req.params;

    const user = getUserById(id);
    if (!user) {
        return res.status(404).json({ error: "User not found" });
    }

    const updatedFields = {};

    if (req.body.fullname) {
        updatedFields.fullname = req.body.fullname;
    }

    if (req.file) {
        // Remove old picture if exists
        if (user.picture) {
            try {
                fs.unlinkSync(path.join("uploads", user.picture));
            } catch (err) {
                console.warn("Failed to delete old picture:", err);
            }
        }

        updatedFields.picture = `/uploads/${req.file.filename}`;
    }

    try {
        await updateUserById(id, updatedFields);
    } catch (error) {
        if (error instanceof NotFoundError) {
            return res.status(404).json({ error: "User not found" });
        } else {
            console.error("Error updating user:", error);
            return res.status(500).json({ error: "Internal server error" });
        }
    }
}
