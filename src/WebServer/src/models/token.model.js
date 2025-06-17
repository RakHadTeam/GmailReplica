import globals from "../core/globals.js";

export function validateCredentials(username, email, password) {
    const user = globals.users.find(
        (u) => (u.username === username || u.email === email) && u.password === password
    );
    return { status: user ? 200 : 401, user };
}
