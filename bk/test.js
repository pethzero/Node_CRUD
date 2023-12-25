const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');
const multer = require('multer');

const ProcessHandler = require('./process');
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


const processHandler = new ProcessHandler(db);

/////////////////////////// GET /////////////////////////////////////
// Routes
// app.get('/api/employees', (req, res) => {
//   db.query('SELECT * FROM employees', (err, results) => {
//     if (err) {
//       console.error('Error executing query:', err);
//       res.status(500).send('Internal Server Error');
//     } else {
//       res.json(results);
//     }
//   });
// });

/////////////////////////////  POST   /////////////////////////////////////
// app.post('/api/employees', upload.none(), (req, res) => {
//     const name = req.body.name;
//     db.query('INSERT INTO employees (name) VALUES (?)', [name], (err, result) => {
//       if (err) {
//         console.error('Error executing query:', err);
//         res.status(500).send('Internal Server Error');
//       } else {
//         res.json({ id: result.insertId, name: name });
//       }
//     });
//   });
/////////////////////////////////////////////////////////////////////
// Routes
// ตัวอย่างการใช้ Transaction ใน Node.js กับ MySQL
// app.post('/api/employees', upload.none(), (req, res) => {
//   // Array ของข้อมูลที่ต้องการเพิ่ม
//   const names = ['A', 'B', 'C', 'D'];

//   // เริ่ม Transaction
//   db.beginTransaction((err) => {
//     if (err) {
//       console.error('Error beginning transaction:', err);
//       return res.status(500).send('Internal Server Error');
//     }

//     // เรียกฟังก์ชัน recursive สำหรับทำ Transaction ทีละรายการ
//     insertEmployee(names, 0, db, res);
//   });
// });

// // ฟังก์ชันทำ Transaction ทีละรายการ
// function insertEmployee(names, index, db, res) {
//   if (index < names.length) {
//     const name = names[index];

//     // ทำการ query ภายใน Transaction
//     db.query('INSERT INTO employees (name) VALUES (?)', [name], (err, result) => {
//       if (err) {
//         console.error('Error executing query:', err);
//         // ถ้ามี error ในการ query ใน Transaction ทำ Rollback
//         return db.rollback(() => {
//           res.status(500).send('RollBack');
//         });
//       }

//       // เรียกตัวเองเพื่อทำ Transaction ของรายการถัดไป
//       insertEmployee(names, index + 1, db, res);
//     });
//   } else {
//     // ถ้าทุกรายการสำเร็จ ทำ Commit Transaction
//     db.commit((err) => {
//       if (err) {
//         console.error('Error committing transaction:', err);
//         return db.rollback(() => {
//           res.status(500).send('Internal Server Error');
//         });
//       }
//       // ส่ง response หลังจาก Commit สำเร็จ
//       console.log('ADD DATA')
//       res.send('All data inserted successfully.');
//     });
//   }
// }
////////////////////////////////////////////////////////////////////////
// app.post('/api/employees', upload.none(), (req, res) => {
//   // เริ่ม Transaction
//   db.beginTransaction((err) => {

//     if (err) {
//       console.error('Error beginning transaction:', err);
//       return res.status(500).send('Internal Server Error');
//     }
//     const name = req.body.name;
//     // ทำการ query ภายใน Transaction
//     db.query('INSERT INTO employees (name) VALUES (?)', [name], (err, result) => {
      
//       if (err) {
//         console.error('Error executing query:', err);
//         // ถ้ามี error ในการ query ใน Transaction ทำ Rollback
//         return db.rollback(() => {
//           res.status(500).send('RollBack');
//         });
//       }

//       // Commit Transaction หาก query ทั้งหมดสำเร็จ
//       db.commit((err) => {
//         if (err) {
//           console.error('Error committing transaction:', err);
//           return db.rollback(() => {
//             res.status(500).send('Internal Server Error');
//           });
//         }
//         // ส่ง response หลังจาก Commit สำเร็จ
//         res.json({ id: result.insertId, name: name });
//       });
      
//     });
//   });
// });
//////////////////////////////////////////////////////////////////////////////////////////////////////
app.post('/api/employees', upload.none(), (req, res) => {
    // const apidata = req.body.apidata;
    // console.log(apidata);
    // parsedData = JSON.parse(apidata);
    // console.log(parsedData);
  processHandler.handleRequestProcess(req, res);
    });
////////////////////////////////////  Mutiple Promise  /////////////////////////////////////////////
// app.post('/api/employees', upload.none(), (req, res) => {
//   // เริ่ม Transaction
//   const apidata = req.body.apidata;
//   console.log(apidata);
//   parsedData = JSON.parse(apidata);
//   console.log(parsedData);

//   // ดึงค่า query จาก parsedData
//   const Sqlquery = parsedData[0].jsondata[0].query;
//   console.log(Sqlquery);

//   const Sqlvalue = parsedData[0].jsondata[0].value;
//   console.log(Sqlvalue);
//   res.json("suscess");
//   // db.beginTransaction((err) => {
//   //   if (err) {
//   //     console.error('Error beginning transaction:', err);
//   //     return res.status(500).send('Internal Server Error');
//   //   }

//   //   const apidata = req.body.apidata;
//   //   parsedData = JSON.parse(apidata);

//   //   if (!Array.isArray(parsedData) || parsedData.length === 0) {
//   //     // ตรวจสอบว่า apidata ไม่ใช่ array หรือเป็น array ที่มีข้อมูล
//   //     return res.status(400).send('Invalid or empty data');
//   //   }
//   //   // console.log(JSON.parse(apidata))

//   //   // ทำการ query ภายใน Transaction โดยใช้ Promise.all เพื่อทำ transaction ทั้งหมดใน array
//   //   Promise.all(parsedData.map(({ name,address }) => {
//   //     return new Promise((resolve, reject) => {
//   //       db.query('INSERT INTO employees (name,address) VALUES (?,?)', [name,address], (err, result) => {
//   //         if (err) {
//   //           console.error('Error executing query:', err);
//   //           reject(err);
//   //         } else {
//   //           resolve(result);
//   //         }
//   //       });
//   //     });
//   //   }))
//   //   .then((results) => {
//   //     // Commit Transaction หากทุกรายการสำเร็จ
//   //     db.commit((err) => {
//   //       if (err) {
//   //         console.error('Error committing transaction:', err);
//   //         return db.rollback(() => {
//   //           res.status(500).send('Internal Server Error');
//   //         });
//   //       }
//   //       // ส่ง response หลังจาก Commit สำเร็จ
//   //       const responseData = results.map(result => ({ id: result.insertId }));
//   //       res.json(responseData);
//   //     });
//   //   })
//   //   .catch((error) => {
//   //     // ถ้ามี error ใน query ใน Transaction ทำ Rollback
//   //     db.rollback(() => {
//   //       console.error('Error during transaction:', error);
//   //       res.status(500).send('Rollback');
//   //     });
//   //   });
//   // });
// });

///////////////////////////////////////////////////////////////////////////////////////////////////////////

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

// app.delete('/api/employees/:id', (req, res) => {
//   const id = req.params.id;

//   db.query('DELETE FROM employees WHERE id = ?', [id], (err) => {
//     if (err) {
//       console.error('Error executing query:', err);
//       res.status(500).send('Internal Server Error');
//     } else {
//       res.json({ id: id });
//     }
//   });
// });

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
