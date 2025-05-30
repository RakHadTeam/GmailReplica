import express from 'express';

const app = express();

const PORT = 3000;

// Middleware to parse incoming JSON requests
app.use(express.json());

// In memory array to store labels
let labels = [];

app.get('/api/labels/:id', (req, res) => {
    const { id } = req.params; // Extracts the 'id' parameter from the URL

    // Find the label in the memory list by its ID
    const label = labels.find(l => l.id === id);

    if (!label) {
        // If label not found, return 404 with error message
        return res.status(404).json({ error: 'Label not found' });
    }

    // If found, return the label with status 200
    res.status(200).json(label);
});

app.patch('/api/labels/:id', (req, res) => {
    const { id } = req.params;       // Gets the ID from the URL
    const { name } = req.body;       // Gets the new name from the request body

    // Validate that 'name' is present

app.get('/api/labels', (req, res) => {
    res.status(200).json(labels); // Respond with HTTP 200 and the labels as JSON
});

app.post('/api/labels', (req, res) => {
    const { name } = req.body; // Destructure 'name' from the request body

    if (!name) {
        return res.status(400).json({ error: 'Name is required' });
    }

    // Find the label by ID
    const label = labels.find(l => l.id === id);

    if (!label) {
        // If label not found, return 404
        return res.status(404).json({ error: 'Label not found' });
    }

    // Update the label name
    label.name = name;

    res.status(204).send();
});

app.delete('/api/labels/:id', (req, res) => {
    const { id } = req.params;

    // Find the index of the label
    const index = labels.findIndex(label => label.id === id);

    if (index === -1) {
        // Not found
        return res.status(404).json({ error: 'Label not found' });
    }

    // Remove the label from the array
    labels.splice(index, 1);

    res.status(204).send();
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