const express = require('express');
const customerController = require('../controllers/customerController');
const router = express.Router();
const authController = require('../controllers/authController');

router
  .route('/')
  .get(customerController.readCustomers)
  .post(customerController.createCustomer);

router
  .route('/:id')
  .get(customerController.readCustomerById)
  .patch(customerController.updateCustomer)
  .delete(customerController.deleteCustomer);

router
  .route('/:id/shippinginfo')
  .post(customerController.addShippingInfo);

router
  .route('/:id/shippinginfo/:sid')
  .patch(customerController.updateShippingInfo)
  .delete(customerController.deleteShippingInfo);
  
module.exports = router;