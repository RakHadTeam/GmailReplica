import multer from "multer";
import path from "path";
import { AlreadyExistsError } from "../../../core/errors/AppError.js";
import { createUser } from "../../../services/user/createUser.js";
import StatusCode from "../../../core/StatusCode.js";

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads/");
    },
    filename: function (req, file, cb) {
        const ext = path.extname(file.originalname);
        cb(null, `${Date.now()}-${file.fieldname}${ext}`);
    },
});

export const upload = multer({ storage });

export async function postUsers(req, res) {
    const { email, password, fullname } = req.body;

    // Validate input
    if (!email || !password || !fullname) {
        return res
            .status(400)
            .json({ error: "Email, password and full name are required" });
    }
    let newUser = {
        email,
        password,
        fullname,
        darkTheme: req.body.darkTheme
            ? req.body.darkTheme === "true" || req.body.darkTheme === true
            : false,
        picture: req.file ? `uploads/${req.file.filename}` : null,
        createdAt: new Date().toISOString(),
    };

    try {
        const userId = await createUser(newUser);
        return res
            .status(StatusCode.CREATED)
            .json({ message: "User created successfully", userId });
    } catch (error) {
        if (error instanceof AlreadyExistsError) {
            return res.status(StatusCode.CONFLICT).json({ error: "User already exists" });
        } else {
            console.error("Error creating user:", error);
            return res.status(StatusCode.INTERNAL_SERVER_ERROR).json({ error: "Internal server error" });
        }
    }
}
