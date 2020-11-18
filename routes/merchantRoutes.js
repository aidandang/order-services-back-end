const express = require('express');
const merchantController = require('../controllers/merchantController');
const router = express.Router();
const authController = require('../controllers/authController');

router
  .route('/')
  .get(merchantController.readMerchants)
  .post(merchantController.createMerchant);

router
  .route('/:id')
  .patch(merchantController.updateMerchant)
  .delete(merchantController.deleteMerchant);
  
module.exports = router;