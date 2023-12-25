const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

app.use(bodyParser.json());

let resources = [
    { id: 1, name: 'Resource 1' },
    { id: 2, name: 'Resource 2' },
    { id: 3, name: 'Resource 3' }
];

// const resources = require('./data.json');

// GET all resources
app.get('/resources', (req, res) => {
    res.json(resources);
});

// GET a specific resource
app.get('/resources/:id', (req, res) => {
    const resourceId = parseInt(req.params.id);
    const resource = resources.find(r => r.id === resourceId);

    if (resource) {
        res.json(resource);
    } else {
        res.status(404).json({ message: 'Resource not found' });
    }
});

// POST a new resource
app.post('/resources', (req, res) => {
    const newResource = req.body;
    console.log(req)
    resources.push(newResource);
    res.status(201).json(newResource);
});

// PUT update a resource
app.put('/resources/:id', (req, res) => {
    const resourceId = parseInt(req.params.id);
    const updatedResource = req.body;
    const index = resources.findIndex(r => r.id === resourceId);

    if (index !== -1) {
        resources[index] = updatedResource;
        res.json(updatedResource);
    } else {
        res.status(404).json({ message: 'Resource not found' });
    }
});

// DELETE a resource
app.delete('/resources/:id', (req, res) => {
    const resourceId = parseInt(req.params.id);
    resources = resources.filter(r => r.id !== resourceId);
    res.json({ message: 'Resource deleted successfully' });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
