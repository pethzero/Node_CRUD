const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');
const multer = require('multer');
const app = express();

const ProcessHandler = require('./process');
require('dotenv').config();

// Middleware for common headers
app.use((req, res, next) => {
  // Set desired headers
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  res.setHeader('X-XSS-Protection', '1; mode=block');

  // Continue to the next middleware
  next();
});

// Logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
  } else {
    console.log('Connected to MySQL');
  }
});

// Configure multer to handle FormData
const upload = multer();

// Enable CORS
app.use(cors());

// Middleware to parse JSON
app.use(bodyParser.json({ encoding: 'utf-8' }));
app.use(bodyParser.urlencoded({ extended: true, encoding: 'utf-8' }));

const processHandler = new ProcessHandler(db);

// GET endpoint
app.get('/api/get', (req, res) => {
  processHandler.handleGetRequest(req, res);
});

// POST endpoint
app.post('/api/post', upload.none(), (req, res) => {
  processHandler.handlePostRequest(req, res);
});

// PUT endpoint
app.put('/api/put/:id', upload.none(), (req, res) => {
  processHandler.handleUpdateRequest(req, res);
});

// DELETE endpoint
app.delete('/api/delete/:id', (req, res) => {
  processHandler.handleDeleteRequest(req, res);
});


app.post('/api/employees', upload.none(), (req, res) => {
  processHandler.handlePostRequestMutiple(req, res); 
  // const apidata = req.body.apidata;

  // try {
  //   const parsedData = JSON.parse(apidata);

  //   if (!Array.isArray(parsedData) || parsedData.length === 0) {
  //     return res.status(400).send('Invalid or empty data');
  //   }

  //   const queries = parsedData.map(({ name, address }) => {
  //     // สร้าง query สำหรับแต่ละรายการ
  //     const query = 'INSERT INTO employees (name, address) VALUES (?, ?)';
  //     const values = [name, address];
  //     return { query, values };
  //   });
  //   console.log(queries);
  //   res.send('All data inserted successfully.');
  //   // ทำ Transaction โดยใช้ executeQueryWithTransactionMultiple
  //   // executeQueryWithTransactionMultiple(queries)
  //   //   .then((results) => {
  //   //     res.json(results);
  //   //   })
  //   //   .catch((error) => {
  //   //     console.error('Error during transaction:', error);
  //   //     res.status(500).send('Rollback');
  //   //   });
  // } catch (error) {
  //   console.error('Error parsing JSON:', error);
  //   res.status(400).send('Invalid JSON format');
  // }
});

// Start the server
const port = process.env.PORT;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
