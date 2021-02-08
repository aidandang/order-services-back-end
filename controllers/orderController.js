const Order = require('../models/orderModel')
const Item = require('../models/itemModel')
const catchAsync = require('../utils/catchAsync')
const AppError = require('../utils/appError')
const { getOrders, getByIdAggr } = require('../aggregations/orderAggregation')

exports.createOrder = catchAsync(async (req, res, next) => {
  const reqBody = { ...req.body }

  // create
  const newOrder = await Order.create(reqBody)
  
  // response
  res.status(201).json({
    status: 'success',
    byId: newOrder
  })
})

exports.readOrders = catchAsync(async (req, res, next) => {
  const { orderNumber, orderStatus, purchasingNumber } = req.query 

  // read all items that matches with the query
  // return error if there is no valid query.
  var match = {}

  if (orderNumber) {
    match = {
      orderNumber: {
        $in: [Number(orderNumber)]
      }
    }
  } else if (orderStatus) {
    match = {
      '$expr': {
        $regexMatch: {
          input: "$status",
          regex: orderStatus,
          options: "i"
        }
      } 
    }  
  } else if (purchasingNumber) {
    match = {
      '$expr': {
        $regexMatch: {
          input: "$purchasing.orderNumber",
          regex: purchasingNumber,
          options: "i"
        } 
      }
    } 
  }

  if (match === null) {
    match = {}
  }

  // find orders and response to the request if success,
  // orders retured would be an empty array if there is no found
  var query = Order.aggregate(getOrders(match))

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
  
  const orders = await query

  res.status(200).json({
    status: 'success',
    info: {
      count: count,
      pages: pages
    },
    allIds: orders
  })
})

exports.readOrderById = catchAsync(async (req, res, next) => {
  const { id } = req.params

  const order = await Order.findById(id)
  
  res.status(200).json({
    status: 'success',
    byId: order
  })
})

exports.updateOrderById = catchAsync(async (req, res, next) => {
  const { id } = req.params
  const reqBody = { ...req.body }

  const updatedOrder = await Order.findByIdAndUpdate(
    id, 
    reqBody, 
    { new: true, runValidators: true }
  )

  res.status(200).json({
    status: 'success',
    byId: updatedOrder
  })
})

exports.readOrdersForReceiving = catchAsync(async (req, res, next) => {
  const match = {
    status: {
      $in: ['partial-received', 'received']
    }
  }

  var query = Order.aggregate(getOrders(match))

  // sort
  if (req.query.sort) {
    const sortBy = req.query.sort.split(',').join(' ')
    query = query.sort(sortBy)
  } else {
    query = query.sort('-createdAt')
  }

  const orders = await query

  res.status(200).json({
    status: 'success',
    allIds: orders
  })
})