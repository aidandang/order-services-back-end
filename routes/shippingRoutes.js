const express = require('express')
const shippingController = require('../controllers/shippingController')
const router = express.Router()
const authController = require('../controllers/authController')

router
  .route('/')
  .get(shippingController.readShipments)
  .post(shippingController.createShipment)

router
  .route('/:id')
  .get(shippingController.readShipment)
  .patch(shippingController.updateShipment)
  
module.exports = router