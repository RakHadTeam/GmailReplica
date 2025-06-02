import { getUserByUsername } from "./userService.js";
import { createUser } from './userService.js';


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

    // Check if the username already exists
    const existingUser = getUserByUsername(username);
    if (existingUser) {
        return res.status(404).json({ error: "Username already exists" });
    }

    newUser = createUser(newUser);

    res.status(201).location(`/api/users/${newUser.id}`).json(newUser);

}
