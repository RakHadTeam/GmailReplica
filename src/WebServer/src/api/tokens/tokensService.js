import globals from '../../core/globals.js';

export function validateCredentials(username, password) {
    const user = globals.users.find(u => u.username === username && u.password === password);
    return { valid: !!user, user };
}