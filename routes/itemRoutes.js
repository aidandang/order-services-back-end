const express = require('express');
const itemController = require('../controllers/itemController');
const router = express.Router();
const authController = require('../controllers/authController');

router
  .route('/')
  .get(itemController.readItems)
  .post(itemController.createItem);

router
  .route('/:id')
  .patch(itemController.updateItem)
  
module.exports = router;