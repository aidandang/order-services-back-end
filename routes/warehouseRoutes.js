const express = require('express');
const warehouseController = require('../controllers/warehouseController');
const router = express.Router();
const authController = require('../controllers/authController');

router
  .route('/')
  .get(warehouseController.readWarehouses)
  .post(warehouseController.createWarehouse);

router
  .route('/:id')
  .patch(warehouseController.updateWarehouse)
  .delete(warehouseController.deleteWarehouse);
  
module.exports = router;