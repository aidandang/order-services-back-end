const express = require('express');
const courierController = require('../controllers/courierController');
const router = express.Router();
const authController = require('../controllers/authController');

router
  .route('/')
  .get(courierController.readCouriers)
  .post(courierController.createCourier);

router
  .route('/:id')
  .patch(courierController.updateCourier)
  .delete(courierController.deleteCourier);
  
module.exports = router;