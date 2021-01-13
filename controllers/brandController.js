const Brand = require('../models/brandModel')
const catchAsync = require('../utils/catchAsync')

exports.createBrand = catchAsync(async (req, res, next) => {
  const newBrand = await Brand.create(req.body)

  // response all ids and byId is the brand just created
  var brands = null
  if (newBrand) {
    brands = await Brand.find().sort('name')
  }

  res.status(201).json({
    status: 'success',
    allIds: brands,
    byId: newBrand
  })
})

exports.readBrands = catchAsync(async (req, res, next) => {
  var query = Brand.find()

  // sort
  if (req.query.sort) {
    const sortBy = req.query.sort.split(',').join(' ')
    query = query.sort(sortBy)
  } else {
    query = query.sort('name')
  }

  const brands = await query

  res.status(200).json({
    status: 'success',
    allIds: brands
  })
})

exports.updateBrand = catchAsync(async (req, res, next) => {
  const { id } = req.params
  const reqBody = { ...req.body }

  const result = await Brand.findByIdAndUpdate(
    id,
    reqBody,
    { new: true, runValidators: true }
  )

  // response all brands and byId the brand just updated
  var brands = null
  if (result) {
    brands = await Brand.find().sort('name')
  }

  res.status(200).json({
    status: 'success',
    allIds: brands,
    byId: result
  })
})

exports.deleteBrand = catchAsync(async (req, res, next) => {
  const { id } = req.params
  
  const result = await Brand.findByIdAndDelete(id)

  // response all brands left after deleting
  var brands = null
  if (result) {
    brands = await Brand.find().sort('name')
  }

  res.status(200).json({
    status: 'success',
    allIds: brands
  })
})