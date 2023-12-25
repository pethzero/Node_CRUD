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
// const upload = multer();
const upload = multer({ dest: 'uploads/' }); // dest: ระบุตำแหน่งที่จะบันทึกไฟล์


// Enable CORS
app.use(cors());

// Middleware to parse JSON
app.use(bodyParser.json({ encoding: 'utf-8' }));
app.use(bodyParser.urlencoded({ extended: true, encoding: 'utf-8' }));

const processHandler = new ProcessHandler(db);
////////////////////////////////// OLD RROCOESS /////////////////////////////////
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
/////////////////////////////////////////////////////////////////////////////////
////////////////////////////////// NEW RROCOESS /////////////////////////////////
// MUTIPLE POST endpoint
app.post('/api/postmutiple', upload.none(), (req, res) => {
  processHandler.handleRequestProcess(req, res);
});
// MUTIPLE PUT endpoint
app.put('/api/postmutiple/:id', upload.none(), (req, res) => {
  processHandler.handleRequestProcess(req, res);
});
//////////////////////////////// UPLOAD RROCOESS /////////////////////////////////
// UPLOAD endpoint
app.post('/api/upload', upload.single('filedata'), (req, res) => {
  processHandler.handleRequestUpload(req, res);
});
app.post('/api/uploadmutiple', upload.array('files', 5), (req, res) => {
  processHandler.handleRequestUploadMultiple(req, res);
});
app.post('/api/uploadarray', upload.fields([{ name: 'fileX', maxCount: 5 }, { name: 'fileY', maxCount: 5 }, { name: 'fileZ', maxCount: 5 }]), (req, res) => {
  processHandler.handleRequestUploadField(req, res);
});

/////////////////////////////////////////////////////////////////////////////////
// Start the server
const port = process.env.PORT;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
