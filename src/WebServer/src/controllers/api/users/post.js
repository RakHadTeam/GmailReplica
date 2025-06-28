import multer from "multer";
import path from "path";
import { createUser } from "../../../models/user.model.js";

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

export function postUsers(req, res) {
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
        picture: req.file ? `uploads/${req.file.filename}` : null,
        createdAt: new Date().toISOString(),
        darkTheme: req.body.darkTheme ?? false,
        mails: [],
        labels: [
            {
                name: "Starred",
                id: "Starred",
                mails: [],
            },
            {
                name: "Bin",
                id: "Bin",
                mails: [],
            },
            {
                name: "Spam",
                id: "Spam",
                mails: [],
            },
            {
                name: "Sent",
                id: "Sent",
                mails: [],
            },
        ],
    };

    const { status, error } = createUser(newUser);
    if (status === 201) {
        return res.status(201).json({ message: "User created successfully" });
    } else {
        return res
            .status(status)
            .json({ error: error || "User creation failed" });
    }
}
