import { randomUUID } from "crypto";
import globals from "../core/globals.js";

export function getUserById(id) {
    return globals.users.find((user) => user.id === id);
}

export function getUserByEmail(email) {
    return globals.users.find((user) => user.email === email);
}

export function createUser(data) {
    const id = randomUUID();

    if (getUserByEmail(data.email)) {
        return { status: 400, error: "Email already exists" };
    }

    const newUser = { id, ...data };
    globals.users.push(newUser);
    return { status: 201 };
}
