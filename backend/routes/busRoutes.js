const express = require('express');
const router = express.Router();

// Define your routes here
router.get('/', (req, res) => {
  res.send('Bus route');
});

// Export the router instance
module.exports = router; 