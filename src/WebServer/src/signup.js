import { randomUUID } from "crypto";

function signupHandler(users, req, res) {
	const { username, password, fullName, picture } = req.body;

	// Validate input
	if (!username || !password || !fullName) {
		return
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

	// Add the new user to the in memory array
	users.push(newUser);

}

export default signupHandler;
