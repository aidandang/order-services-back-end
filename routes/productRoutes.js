const express = require('express')
const productController = require('../controllers/productController')
const router = express.Router()
// const authController = require('../controllers/authController')

router
  .route('/')
  .get(productController.readProducts)
  .post(productController.createProduct)  

router
  .route('/:id')
  .get(productController.readProductById)
  .patch(productController.updateProductById)
  .delete(productController.deleteProductById)
  
module.exports = router