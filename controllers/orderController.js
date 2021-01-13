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
  const id = req.params.id

  // find the order with a provided id, 
  // look up in item collection to get items of the order
  // and return error if the order is not found
  // otherwise return the order with items sorted by createdAt
  const order = await Order.aggregate(getByIdAggr(id))

  if (order.length === 0) return next(new AppError('No order found.', 404)) 
  
  res.status(200).json({
    status: 'success',
    byId: order[0]
  })
})

exports.updateOrderById = catchAsync(async (req, res, next) => {
  const { id } = req.params
  const { items } = req.body
  const obj = { ...req.body }
  delete obj.items

  // before updating, the existing order needed to saved
  // as a new revision
  
  // check if order found, return error if not
  const found = await Order.findOne({ _id: id })

  if (!found) return next(new AppError('No order found.', 404))

  // get existing items
  const existingItems = await Item.find({ orderNumber: found.orderNumber })

  // update order
  const updated = await Order.findByIdAndUpdate(
    id, 
    obj, 
    { runValidators: true }
  )

  // update multile items to items collection
  // if updating items have any item without _id then insert that item as a new one
  // if existing items of the order have any item that updating items don't have 
  // then delete that item
  
  const query = []
  var i = 0

  // add update and create operations to query
  for (i = 0; i < items.length; i++) {
    if (items[i]._id) {
      query.push({
        updateOne: {
          "filter": { _id: items[i]._id },
          "update": items[i]
        }
      })
    } else {
      query.push({
        insertOne: {
          "document": items[i]
        }
      })
    }
  }

  // add delete operations to query
  var j = 0
  for (i = 0; i < existingItems.length; i++) {
    var isDelete = true
    for (j = 0; j < items.length; j++) {
      if (existingItems[i]._id == items[j]._id) {
        isDelete = false
      }
    }
    if (isDelete) {
      query.push({
        deleteOne: {
          "filter": { _id: existingItems[i]._id }
        }
      })
    }
  }

  await Item.bulkWrite(query)

  // get updated orders and response
  const order = await Order.aggregate(getByIdAggr(id))

  res
    .status(200)
    .json({
      status: 'success',
      byId: order[0]
    })
})