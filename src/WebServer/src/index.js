import express from 'express';
import { v4 as uuidv4 } from 'uuid';

const app = express();

const PORT = 3000;

// Middleware to parse incoming JSON requests
app.use(express.json());

// In memory array to store labels
let labels = [];

app.get('/api/labels', (req, res) => {
    res.status(200).json(labels); // Respond with HTTP 200 and the labels as JSON
});

app.post('/api/labels', (req, res) => {
    const { name } = req.body; // Destructure 'name' from the request body

    if (!name) {
        return res.status(400).json({ error: 'Name is required' });
    }

    // Create a new label object with a unique ID
    const newLabel = {
        id: uuidv4(),
        name
    };

    // Add the new label to the in-memory array
    labels.push(newLabel);

    // Respond with 201 Created and set the Location header to the new resource
    res.status(201).location(`/api/labels/${newLabel.id}`).send();
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
