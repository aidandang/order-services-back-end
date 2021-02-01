const express = require('express');
const receivingController = require('../controllers/receivingController');
const router = express.Router();
const authController = require('../controllers/authController');

router
  .route('/')
  .get(receivingController.readReceivings)
  .post(receivingController.createReceiving);

router
  .route('/:id')
  .get(receivingController.readReceivingById)
  .patch(receivingController.updateReceiving)
//   .delete(receivingController.deleteTracking);
  
module.exports = router;