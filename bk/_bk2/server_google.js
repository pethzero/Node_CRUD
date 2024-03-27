const mysql = require('mysql2');

// กำหนดค่าเชื่อมต่อกับฐานข้อมูล MySQL
const connection = mysql.createConnection({
  host: '35.221.239.190', // หรือ IP ของ Cloud SQL Proxy
  user: 'root',
  password: '123456789',
  database: 'testdb'
});

// เรียกใช้งานคำสั่งคิวรี่
connection.query(
  'SELECT * FROM your_table',
  function(err, results, fields) {
    if (err) {
      console.error(err);
      return;
    }
    console.log(results); // แสดงผลลัพธ์
  }
);

// ปิดการเชื่อมต่อเมื่อเสร็จสิ้น
connection.end();
