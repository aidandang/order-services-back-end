const express = require('express')
const orderController = require('../controllers/orderController')
const router = express.Router()

router
  .route('/')
  .get(orderController.readOrders)
  .post(orderController.createOrder)

router
  .route('/receiving')
  .get(orderController.readOrdersForReceiving)

router
  .route('/:id')
  .get(orderController.readOrderById)
  .patch(orderController.updateOrderById)

module.exports = router