const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');
const multer = require('multer');

const app = express();
const port = 3000;

// Enable CORS
app.use(cors());
app.use(bodyParser.json());

// MySQL connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '1234',
  database: 'test',
});

// Configure multer to handle FormData
const upload = multer();


db.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
  } else {
    console.log('Connected to MySQL');
  }
});

// Middleware to parse JSON
app.use(bodyParser.json());

// Routes
app.get('/api/employees', (req, res) => {
  db.query('SELECT * FROM employees', (err, results) => {
    if (err) {
      console.error('Error executing query:', err);
      res.status(500).send('Internal Server Error');
    } else {
      res.json(results);
    }
  });
});

// Routes
app.post('/api/employees', upload.none(), (req, res) => {
    const name = req.body.name;

    db.query('INSERT INTO employees (name) VALUES (?)', [name], (err, result) => {
      if (err) {
        console.error('Error executing query:', err);
        res.status(500).send('Internal Server Error');
      } else {
        res.json({ id: result.insertId, name: name });
      }
    });
  });
  

app.put('/api/employees/:id', upload.none(), (req, res) => {
  const id = req.params.id;
  const name = req.body.name;
  console.log('update'+name)
  db.query('UPDATE employees SET name = ? WHERE id = ?', [name, id], (err) => {
    if (err) {
      console.error('Error executing query:', err);
      res.status(500).send('Internal Server Error');
    } else {
      res.json({ id: id, name: name });
    }
  });
});

app.delete('/api/employees/:id', (req, res) => {
  const id = req.params.id;

  db.query('DELETE FROM employees WHERE id = ?', [id], (err) => {
    if (err) {
      console.error('Error executing query:', err);
      res.status(500).send('Internal Server Error');
    } else {
      res.json({ id: id });
    }
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
