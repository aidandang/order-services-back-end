const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId
const Product = require('../models/productModel')
const catchAsync = require('../utils/catchAsync')
const { getProducts } = require('../aggregations/productAggregation')

exports.createProduct = catchAsync(async (req, res, next) => {
  const reqBody = { ...req.body }

  // create
  const newProduct = await Product.create(reqBody)

  // response
  res.status(201).json({
    status: 'success',
    byId: newProduct
  })
})

exports.readProducts = catchAsync(async (req, res, next) => {
  const { name, styleCode } = req.query

  var match = null

  if (name) {
    match = {
      '$expr': {
          $regexMatch: {
          input: "$name",
          regex: name,
          options: "i"
        }
      } 
    }  
  } else if (styleCode) {
    match = {
      '$expr': {
          $regexMatch: {
          input: "$styleCode",
          regex: styleCode,
          options: "i"
        }
      } 
    }  
  }

  if (match === null) {
    match = {}
  }

  // set query
  var query = Product.aggregate(getProducts(match))

  // sort
  if (req.query.sort) {
    const sortBy = req.query.sort.split(',').join(' ')
    query = query.sort(sortBy)
  } else {
    query = query.sort('-createdAt')
  }

  // pagination
  const page = req.query.page * 1 || 1
  const limit = req.query.limit * 1 || 5
  const skip = (page - 1) * limit

  const arr = await query
  const count = arr.length
  const pages = Math.ceil(count/limit)

  query = query.skip(skip).limit(limit)

  // get products
  const products = await query

  res.status(200).json({
    status: 'success',
    info: {
      count,
      pages
    },
    allIds: products
  })
})

exports.readProductById = catchAsync(async (req, res, next) => {
  const id = req.params.id
  const match = { _id: ObjectId(id) }
  const product = await Product.findOne(match)
  
  res.status(200).json({
    status: 'success',
    byId: product
  })
})

exports.updateProductById = catchAsync(async (req, res, next) => {
  const { id } = req.params
  const reqBody = { ...req.body }

  const updateProduct = await Product.findByIdAndUpdate(
    id, 
    reqBody, 
    { new: true, runValidators: true }
  )

  if (!updateProduct) {
    return next(new AppError('No product found with that Id', 404))
  }

  res
    .status(200)
    .json({
      status: 'success',
      byId: updateProduct
    })
})

exports.deleteProductById = catchAsync(async (req, res, next) => {
  const { id } = req.params

  // delete
  const result = await Product.findByIdAndDelete(
    id
  )

  if (!result) {
    return next(new AppError('No product found with that Id', 404))
  }

  res
    .status(200)
    .json({
      status: 'success',
      product: result
    })
})