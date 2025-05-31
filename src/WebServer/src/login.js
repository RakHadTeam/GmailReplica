function loginHandler(users, req, res) {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required' });
    }

    const user = users.find(u => u.username === username && u.password === password);

    if (!user) {
        return res.status(400).json({ error: 'Invalid credentials' });
    }

    const token = `${user.id}-token`;

    // Respond with token
    return res.status(200).json({ token });
}

export default loginHandler;
