const express = require('express');
const productController = require('../controllers/productController');
const router = express.Router();
const authController = require('../controllers/authController');

router
  .route('/')
  .get(productController.readProducts)
  .post(productController.createProduct);  

router
  .route('/:id')
  .get(productController.readProductById)
  .patch(productController.updateProductById)
  .delete(productController.deleteProductById)

router
  .route('/:id/colors/')
  .post(productController.addColor);

router
  .route('/:id/colors/:sid')
  .patch(productController.updateColor)
  .delete(productController.deleteColor);
  
module.exports = router;