import express from 'express';

const app = express();

const PORT = 3000;

app.use(express.json());

let labels = [];

app.get('/api/labels', (req, res) => {
    res.status(200).json(labels);
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
