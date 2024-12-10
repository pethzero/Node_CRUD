const dbConnection = require('../config/dbConnection');

// Controller สำหรับ /test
async function testHandler(req, res) {
  try {
    const result = await dbConnection.executeQuery('default', 'SELECT "Hello world" WHERE 1 = 1');
    console.log({ success: true, data: result })
    res.json({ success: true, data: result });
  } catch (err) {
    console.error('Error in testHandler:', err);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
}

module.exports = {
  testHandler,
};
