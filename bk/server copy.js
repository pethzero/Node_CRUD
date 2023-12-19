const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');
const multer = require('multer');

const app = express();
const port = 3000;
const ProcessHandler = require('../process');
///////////////////// UPDATE LOG 16/12/2566 /////////////////////
app.use((req, res, next) => {
  // เพิ่ม headers ตามที่ต้องการ
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  res.setHeader('X-XSS-Protection', '1; mode=block');

  // ผ่านไปทำ middleware ถัดไป
  next();
});

app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// const corsOptions = {
//   origin: 'http://your-client-app.com',  // ตั้งค่า origin ที่ยอมรับเฉพาะ
//   optionsSuccessStatus: 200, // ให้ browser รับ response status 200 ไปเลย
// };

// app.use(cors(corsOptions));

////////////////////////////////////////
/////////////////////////////////////////////////
// MySQL connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '1234',
  database: 'test'
  // charset: 'utf8mb4'
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


// Enable CORS
app.use(cors());
// Middleware to parse JSON
// app.use(bodyParser.json());
app.use(bodyParser.json({ encoding: 'utf-8' }));
app.use(bodyParser.urlencoded({ extended: true, encoding: 'utf-8' }));

const processHandler = new ProcessHandler(db);
///////////////////////////////GET/////////////////////////////////////
app.get('/api/get', (req, res) => {
  processHandler.handleGetRequest(req, res);
});
///////////////////////////////POST/////////////////////////////////////
app.post('/api/post', upload.none(), (req, res) => {
  console.log(typeof req.body)
  console.log(req.body)
  processHandler.handlePostRequest(req, res);
});

///////////////////////////////PUT/////////////////////////////////////
app.put('/api/put/:id', upload.none(), (req, res) => {
  processHandler.handleUpdateRequest(req, res);
});

///////////////////////////////DELETE/////////////////////////////////////
app.delete('/api/delete/:id', (req, res) => {
  processHandler.handleDeleteRequest(req, res);
});

///////////////////////////////////////////////////////////////////////////
// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
