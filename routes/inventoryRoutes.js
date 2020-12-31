const express = require('express')
const inventoryController = require('../controllers/inventoryController')
const router = express.Router()
const authController = require('../controllers/authController')

router
  .route('/')
  .get(inventoryController.readInventory)
  
module.exports = router