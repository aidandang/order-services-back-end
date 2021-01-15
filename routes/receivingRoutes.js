const express = require('express');
const receivingController = require('../controllers/receivingController');
const router = express.Router();
const authController = require('../controllers/authController');

router
  .route('/')
  .get(receivingController.readTrackings)
  .post(receivingController.createTracking);

router
  .route('/:id')
  .patch(receivingController.updateTracking)
//   .delete(receivingController.deleteTracking);
  
module.exports = router;