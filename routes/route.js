const express = require('express');
const router = express.Router();
const { testHandler } = require('../controllers/fuc'); // Import controller

// Route /test
router.get('/test', testHandler);

module.exports = router;