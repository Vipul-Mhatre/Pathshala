const express = require('express');
const router = express.Router();
const { 
  getBuses, 
  addBus, 
  updateBus, 
  deleteBus,
  updateLocation 
} = require('../controllers/busController');
const authMiddleware = require('../middleware/authMiddleware');

// Apply auth middleware to all routes
router.use(authMiddleware);

// Bus routes
router.get('/', getBuses);
router.post('/', addBus);
router.put('/:id', updateBus);
router.delete('/:id', deleteBus);
router.put('/:id/location', updateLocation);

module.exports = router;