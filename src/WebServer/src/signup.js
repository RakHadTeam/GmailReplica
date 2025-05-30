import { randomUUID } from "crypto";

function signupHandler(users, req, res) {
	const { username, password, fullName, picture } = req.body;

	// Validate input
	if (!username || !password || !fullName) {
		return res.status(400).json({ error: 'Username, password, and full name are required' });
	}
	const newUser = {
		id: randomUUID(),
		username,
		password,
		fullName,
		picture,
	};

	// Check if the username already exists
	const existingUser = users.find((user) => user.username === username);
	if (existingUser) {
		return res.status(404).json({ error: 'Username already exists' });
	}

	// Add the new user to the in memory array
	users.push(newUser);
	
	res.status(201).location(`/api/users/${newUser.id}`).send();
}

export default signupHandler;
