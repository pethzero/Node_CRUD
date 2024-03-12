const mysql = require('mysql2');
const bodyParser = require('body-parser');
const express = require('express');
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
////////////////////////////////// OLD RROCOESS V2 /////////////////////////////////
app.get('/api/data', (req, res) => {
  // Query เพื่อดึงข้อมูลจากตาราง products
  const productsQuery = 'SELECT * FROM product';
  db.query(productsQuery, (errProducts, resultsProducts) =>
   {
    if (errProducts) {
      console.error('Error executing products query:', errProducts);
      res.status(500).send('Internal Server Error');
      return;
    }

    // Query เพื่อดึงข้อมูลจากตาราง boms
    const bomsQuery = 'SELECT * FROM bom';
    db.query(bomsQuery, (errBoms, resultsBoms) => {
      if (errBoms) {
        console.error('Error executing boms query:', errBoms);
        res.status(500).send('Internal Server Error');
        return;
      }
      
      const bomprocsQuery = 'SELECT * FROM bomproc';
      db.query(bomprocsQuery, (errBomprocs, resultsBomprocs) => {
        if (errBomprocs) {
          console.error('Error executing boms query:', errBomprocs);
          res.status(500).send('Internal Server Error');
          return;
        }
          // ส่งข้อมูลทั้งหมดกลับไปยัง Vue.js
          res.json({
            products: resultsProducts,
            boms: resultsBoms,
            bomprocs: resultsBomprocs
          });
        });
        // // ส่งข้อมูลทั้งหมดกลับไปยัง Vue.js
        // res.json({
        //   products: resultsProducts,
        //   boms: resultsBoms
        //   // bomprocs: resultsBomprocs
        // });
      });
    });
  });

  ////////////////////////////////// OLD RROCOESS /////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////
  // Start the server
  const port = process.env.PORT;
  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });
