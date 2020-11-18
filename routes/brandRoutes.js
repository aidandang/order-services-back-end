const express = require('express');
const brandController = require('../controllers/brandController');
const router = express.Router();
const authController = require('../controllers/authController');

router
  .route('/')
  .get(brandController.readBrands)
  .post(brandController.createBrand);

router
  .route('/:id')
  .patch(brandController.updateBrand)
  .delete(brandController.deleteBrand);
  
module.exports = router;