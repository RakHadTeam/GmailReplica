import { randomUUID } from "crypto";
import globals from "../../core/globals.js";

export function getUserById(id) {
    return globals.users.find((user) => user.id === id);
}

export function getUserByUsername(username) {
    return globals.users.find((user) => user.username === username);
}

export function createUser(data) {
    const id = randomUUID();

    if (getUserByUsername(data.username)) {
        return { status: 400, error: "Username already exists" };
    }

    const newUser = { id, ...data };
    globals.users.push(newUser);
    return { status: 201 };
}
