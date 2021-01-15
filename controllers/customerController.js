const Customer = require('../models/customerModel')
const catchAsync = require('../utils/catchAsync')
const { getCustomers } = require('../aggregations/customerAggregation')

exports.createCustomer = catchAsync(async (req, res, next) => {
  const reqBody = { ...req.body }

  // create
  const newCustomer = await Customer.create(reqBody)

  // response
  res.status(201).json({
    status: 'success',
    byId: newCustomer
  })
})

exports.readCustomers = catchAsync(async (req, res, next) => {
  const { customerNumber, phone, nickname, fullname, streetAddress1 } = req.query

  var match = null

  if (customerNumber) {
    match = {
      customerNumber: {
        $in: [Number(customerNumber)]
      }
    }  
  } else if (phone) {
    match = {
      '$expr': {
        $regexMatch: {
          input: "$phone",
          regex: phone,
          options: "i"
        }
      } 
    }  
  } else if (nickname) {
    match = {
      '$expr': {
        $regexMatch: {
          input: "$nickname",
          regex: nickname,
          options: "i"
        }
      } 
    }  
  } else if (fullname) {
    match = {
      '$expr': {
        $regexMatch: {
          input: "$fullname",
          regex: fullname,
          options: "i"
        }
      } 
    }  
  } else if (streetAddress1) {
    match = {
      '$expr': {
        $regexMatch: {
          input: "$streetAddress1",
          regex: streetAddress1,
          options: "i"
        }
      } 
    }  
  }

  if (match === null) {
    match = {}
  }

  // set query
  var query = Customer.aggregate(getCustomers(match))

  // sort
  if (req.query.sort) {
    const sortBy = req.query.sort.split(',').join(' ')
    query = query.sort(sortBy)
  } else {
    query = query.sort('-createdAt')
  }

  // pagination
  const page = req.query.page * 1 || 1
  const limit = req.query.limit * 1 || 10
  const skip = (page - 1) * limit

  const arr = await query
  const count = arr.length
  const pages = Math.ceil(count/limit)

  query = query.skip(skip).limit(limit)

  // get customer
  const customers = await query
  
  res.status(200).json({
    status: 'success',
    info: {
      count: count,
      pages: pages
    },
    allIds: customers
  })
})

exports.readCustomerById = catchAsync(async (req, res, next) => {
  const { id } = req.params

  const customer = await Customer.findById(id)
  
  res.status(200).json({
    status: 'success',
    byId: customer
  })
})

exports.updateCustomerById = catchAsync(async (req, res, next) => {
  const { id } = req.params
  const reqBody = { ...req.body }

  const updateCustomer = await Customer.findByIdAndUpdate(
    id, 
    reqBody, 
    { new: true, runValidators: true }
  )

  res.status(200).json({
    status: 'success',
    byId: updateCustomer
  })
})

exports.deleteCustomerById = catchAsync(async (req, res, next) => {
  const { id } = req.params

  // delete
  const result = await Customer.findByIdAndDelete(id)

  res.status(200).json({
    status: 'success',
    product: result
  })
})