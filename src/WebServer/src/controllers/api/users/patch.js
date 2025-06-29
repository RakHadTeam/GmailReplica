import { getUserById, updateUserById } from "../../../models/user.model.js";
import fs from "fs";
import path from "path";

export function patchUserByIdHandler(req, res) {
    const { id } = req.params;

    const user = getUserById(id);
    if (!user) {
        return res.status(404).json({ error: "User not found" });
    }

    const updatedFields = {};

    if (req.body.fullname) {
        updatedFields.fullname = req.body.fullname;
    }

    if (req.body.darkTheme !== undefined) {
        updatedFields.darkTheme = req.body.darkTheme;
    }

    if (req.file) {
        // Remove old picture if exists
        if (user.picture) {
            try {
                fs.unlinkSync(user.picture);
            } catch (err) {
                console.warn("Failed to delete old picture:", err);
            }
        }

        updatedFields.picture = `uploads/${req.file.filename}`;
    }

    updateUserById(id, updatedFields); // implement this in your model

    res.status(204).json({ message: "User updated successfully" });
}


