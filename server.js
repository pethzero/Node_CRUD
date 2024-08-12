// server.js
const express = require('express');
const dbConnection = require('./config/dbConnection');
const app = express();

// ฟังก์ชันสำหรับเชื่อมต่อกับฐานข้อมูลทั้งหมด
async function initializeConnections() {
  try {
    await dbConnection.connect('default');
    await dbConnection.connect('db_maria');
    await dbConnection.connect('api_postgres');
    console.log('All database connections established');
  } catch (err) {
    console.error('Error initializing database connections:', err);
    process.exit(1); // หยุดการทำงานของโปรแกรมหากการเชื่อมต่อฐานข้อมูลล้มเหลว
  }
}

// เริ่มต้นเซิร์ฟเวอร์หลังจากเชื่อมต่อฐานข้อมูลเสร็จ
async function startServer() {
  await initializeConnections();
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

// เริ่มต้นเซิร์ฟเวอร์
startServer();

// ปิดการเชื่อมต่อเมื่อเซิร์ฟเวอร์หยุดทำงาน
process.on('SIGINT', async () => {
  await dbConnection.closeConnections();
  process.exit();
});
