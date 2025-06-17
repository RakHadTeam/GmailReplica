import globals from "../core/globals.js";

export function validateCredentials(email, password) {
    const user = globals.users.find(
        (u) => u.email === email && u.password === password
    );
    return { status: user ? 200 : 401, user };
}
