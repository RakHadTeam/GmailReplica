import express from 'express';
import { getUserById } from './userService.js';


export function getUserByIdHandler(req, res) {
    const { id } = req.params;
    const user = getUserById(id);
    if (!user) {
        return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json(user);
}
