import { createUser } from "../../../models/user.model.js";


export function postUsers(req, res) {
    const { username, password, email, fullname, picture } = req.body;

    // Validate input
    if (!username || !password || !fullname || !email) {
        return res
            .status(400)
            .json({ error: "Username, password, full name, and email are required" });
    }
    let newUser = {
        username,
        password,
        email,
        fullname,
        picture,
        createdAt: new Date().toISOString(),
        mails: [],
        labels: [],
    };

    const { status } = createUser(newUser);

    res.status(status).send();

}
