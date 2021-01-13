const Merchant = require('../models/merchantModel')
const catchAsync = require('../utils/catchAsync')

exports.createMerchant = catchAsync(async (req, res, next) => {
  const newMerchant = await Merchant.create(req.body)

   // response all ids and byId is the brand just created
  var merchants = null
  if (newMerchant) {
    merchants = await Merchant.find().sort('name')
  }

  res.status(201).json({
    status: 'success',
    allIds: merchants,
    byId: newMerchant
  })
})

exports.readMerchants = catchAsync(async (req, res, next) => {
  var query = Merchant.find()

  // sort
  if (req.query.sort) {
    const sortBy = req.query.sort.split(',').join(' ')
    query = query.sort(sortBy)
  } else {
    query = query.sort('name')
  }

  const merchants = await query 

  res.status(200).json({
    status: 'success',
    allIds: merchants
  })
})

exports.updateMerchant = catchAsync(async (req, res, next) => {
  const { id } = req.params
  const reqBody = { ...req.body }
  const result = await Merchant.findByIdAndUpdate(
    id,
    reqBody,
    { new: true, runValidators: true }
  )

  // response all ids and byId the merchant just updated
  var merchants = null
  if (result) {
    merchants = await Merchant.find().sort('name')
  }

  res.status(200).json({
    status: 'success',
    allIds: merchants,
    byId: result
  })
})

exports.deleteMerchant = catchAsync(async (req, res, next) => {
  const id = req.params.id
  
  const merchant = await Merchant.findByIdAndDelete(id)

  // response all ids left after deleting
  var merchants = null
  if (merchant) {
    merchants = await Merchant.find().sort('name')
  }

  res.status(200).json({
    status: 'success',
    allIds: merchants
  })
})