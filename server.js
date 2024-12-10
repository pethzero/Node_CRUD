  // server.js
  const express = require('express');
  const dbConnection = require('./config/dbConnection');
  const app = express();
  const routes = require('./routes/route'); // Import routes

  // ฟังก์ชันสำหรับเชื่อมต่อกับฐานข้อมูลทั้งหมด
  async function initializeConnections() {
    const list_db_name = ['default', 'db_maria', 'api_postgres'];
    try {
      for (const db_name of list_db_name) {
        console.log(`Initializing connection to ${db_name}...`);
        await dbConnection.connect(db_name); // ใช้ dynamic key
        console.log(`Successfully connected to ${db_name}`);
      }
      console.log('All database connections established');
    } catch (err) {
      console.error('Error initializing database connections:', err.message);
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

  process.on('SIGINT', async () => {
    try {
      console.log('Closing connections...');
      await dbConnection.closeConnections();
    } catch (err) {
      console.error('Error during closing connections:', err);
    } finally {
      console.log('Server shutting down');
      process.exit();
    }
  });
  
  // //  TEST
  // async function testDatabases() {
  //   try {
  //     const result = await dbConnection.executeQuery('default', 'SELECT "Hello world" WHERE 1 = 1');
  //     console.log(result);
  //     return result; // คืนผลลัพธ์ให้ endpoint
  //   } catch (err) {
  //     console.error('Error:', err);
  //     throw err;
  //   }
  // }

  // // Endpoint สำหรับทดสอบการเชื่อมต่อ
  // app.get('/test', async (req, res) => {
  //   const results = await testDatabases();
  //   res.json(results); // ส่งผลลัพธ์กลับไป
  // });

  app.use('/', routes); // เชื่อม routes