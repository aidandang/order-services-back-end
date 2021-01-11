const express = require('express')
const customerController = require('../controllers/customerController')
const router = express.Router()
// const authController = require('../controllers/authController')

router
  .route('/')
  .get(customerController.readCustomers)
  .post(customerController.createCustomer)

router
  .route('/:id')
  .get(customerController.readCustomerById)
  .patch(customerController.updateCustomerById)
  .delete(customerController.deleteCustomerById)
  
module.exports = router