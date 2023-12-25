const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');
const multer = require('multer');

const app = express();
// app.use(express.json({ encoding: 'utf-8' }));
const port = 3000;

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



/////////////////////////// GET /////////////////////////////////////
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
/////////////////////////////////////////////////////////////////////
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

///////////////////////////////////////////////////////////////////////////
app.delete('/api/employees/:id', (req, res) => {
  const id = req.params.id;

  db.query('DELETE FROM employees WHERE id = ?', [id], (err) => {
    if (err) {
      console.error('Error executing query:', err);
      res.status(500).send('Internal Server Error');
    } else {
      res.status(204).send(); // ส่ง Status Code 204 (No Content) แทนการส่งข้อมูล
    }
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
