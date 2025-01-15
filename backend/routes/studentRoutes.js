const express = require('express');
const router = express.Router();

// Example route
router.get('/', (req, res) => {
  res.send('Student route');
});

// Export the router instance
module.exports = router; 