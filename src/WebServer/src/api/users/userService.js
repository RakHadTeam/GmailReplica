import globals from '../../core/globals.js';
import crypto from 'crypto';

export function getUserById(id) {
    return globals.users.find((user) => user.id === id);
}

export function getUserByUsername(username) {
    return globals.users.find((user) => user.username === username);
}

export function createUser(data) {
    const id = crypto.randomUUID();
    const newUser = { id, ...data };
    globals.users.push(newUser);
    return newUser;
}