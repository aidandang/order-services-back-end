const express = require('express')
const inventoryController = require('../controllers/inventoryController')
const router = express.Router()
const authController = require('../controllers/authController')

router
  .route('/')
  .get(inventoryController.readInventory)

router
  .route('/receiving/check/:id')
  .patch(inventoryController.updateReceivedTrackingCheck)

router
  .route('/receiving/process/:id')
  .patch(inventoryController.updateReceivedTrackingProcess)
  
module.exports = router