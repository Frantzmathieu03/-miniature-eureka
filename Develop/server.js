const express = require("express");
const fs = require("fs");
const path = require("path");


const app = express()
const PORT=3000;

// Middleware to parse JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));

app.get("/notes", (req,res)=>{
    res.sendFile(path.join(__dirname, "public", "notes.html"))
})

app.get('/api/notes', (req, res) => {
    fs.readFile(path.join(__dirname, 'db.json'), 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to read notes' });
        }
        res.json(JSON.parse(data));
    });
});

app.post('/api/notes', (req, res) => {
    const { title, text } = req.body;

    // Validate the structure of the new note
    if (!title || !text) {
        return res.status(400).json({ error: 'Note must have a title and text' });
    }

    const newNote = { title, text };
    
    // Read the current notes from db.json
    fs.readFile(path.join(__dirname, "db", 'db.json'), 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to read notes' });
        }
        const notes = JSON.parse(data);

        // Add the new note
        notes.push(newNote);

        // Save the updated notes back to db.json
        fs.writeFile(path.join(__dirname, 'db.json'), JSON.stringify(notes, null, 2), (err) => {
            if (err) {
                return res.status(500).json({ error: 'Failed to save note' });
            }
            res.status(201).json(newNote);
        });
    });
})

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});