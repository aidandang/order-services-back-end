const express = require('express');
const consigneeController = require('../controllers/consigneeController');
const router = express.Router();
const authController = require('../controllers/authController');

router
  .route('/')
  .get(consigneeController.readConsignees)
  .post(consigneeController.createConsignee);

router
  .route('/:id')
  .patch(consigneeController.updateConsignee)
  .delete(consigneeController.deleteConsignee);
  
module.exports = router;