const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId
const Order = require('../models/orderModel')
const Item = require('../models/itemModel')
const catchAsync = require('../utils/catchAsync')
const AppError = require('../utils/appError')
const { orderAggregate } = require('../utils/aggregation')
const { update } = require('../models/orderModel')

exports.readOrders = catchAsync(async (req, res, next) => {
  const queryObj = { ...req.query }

  // read all items that matches with the query
  // return error if there is no valid query.
  var match = {}
  var orderNumber = null
  var orderStatus = null
  var purchasingNumber = null

  if (queryObj.orderNumber) {
    orderNumber = queryObj.orderNumber.split(',')
    match.orderNumber = {
      $in: orderNumber
    }  
  } 
  
  if (queryObj.orderStatus) {
    orderStatus = queryObj.orderStatus.split(',')
    match = {
      status: {
        $in: orderStatus
      } 
    }
  } 

  if (queryObj.purchasingNumber) {
    purchasingNumber = queryObj.purchasingNumber
    match['$expr'] = {
      $regexMatch: {
        input: "$purchasingNumber",
        regex: purchasingNumber,
        options: "i"
      } 
    } 
  } 

  // find orders and response to the request if success,
  // orders retured would be an empty array if there is no found
  let query = Order.aggregate(orderAggregate(match))

  const arr = await query
  const count = arr.length

  // sort and paginate found orders
  if (queryObj.sort) {
    query = query.sort(query.sort.split(',').join(' '))
  } else {
    query = query.sort('-createdAt')
  }

  const page = queryObj.page * 1 || 1
  const limit = queryObj.limit * 1 || 20
  const skip = (page - 1) * limit
  const pages = Math.ceil(count/limit)

  query = query.skip(skip).limit(limit)
  
  const orders = await query

  res.status(200).json({
    status: 'success',
    info: {
      count,
      pages
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
  const order = await Order.aggregate([
    { 
      $match: {
        _id: ObjectId(id)
      } 
    },
    {
      $lookup: {
        from: 'items',
        localField: 'orderNumber',
        foreignField: 'orderNumber',
        as: 'items'
      }      
    },
    { 
      $sort: {
        'item.createdAt': -1
      }
    }
  ])

  if (order.length === 0) { 
    return next(new AppError('No order found.', 404)) 
  } else {
    res.status(200).json({
      status: 'success',
      byId: order[0]
    })
  }
})

exports.createOrder = catchAsync(async (req, res, next) => {
  const obj = { ...req.body }

  // create new order and return a success response
  // with that new order
  const newOrder = await Order.create(obj)
  
  res.status(201).json({
    status: 'success',
    byId: newOrder
  })
})

exports.updateOrderById = catchAsync(async (req, res, next) => {
  const id = req.params.id
  const obj = { ...req.body }
  delete obj.items
  const items = [ ...req.body.items ]

  // before updating, the existing order needed to saved
  // as a new revision
  
  // check if order found, return error if not
  const found = await Order.findOne({ _id: id })

  if (!found) return next(new AppError('No order found.', 404))

  // copy 'rev' (revision) element from found order
  // and create a new revision to this existing order
  // with the key name is a time stamp 
  const rev = { ...found.rev }
  const existingOrder = { ...found }
  delete existingOrder.rev

  rev[Date.now()] = { ...existingOrder }

  // added the new rev to req body then update,
  // return a success response with updated order
  obj.rev = rev

  const updated = await Order.findByIdAndUpdate(
    id, 
    obj, 
    { new: true, runValidators: true }
  )

  // update multile items to items collection
  // if updating items have any item without _id then insert that item as a new one
  // if existing items of the order have any item that updating items don't have 
  // then delete that item

  // get existing items
  const existingItems = Item.find({ orderNumber: obj.orderNumber })
  
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
  for (i = 0; i < existingItems.length; i++) {
    if (existingItems[i]._id) {
      var j = 0
      var isDelete = true
      for (j = 0; j < items.length; j++) {
        if (existingItems[i]._id === items[j]._id) {
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
  }

  const result = await Item.bulkWrite(query)

  console.log(result)
  console.log(query)

  // get updated items and add to the updated orders
  const updatedItems = await Item.find({ orderNumber: obj.orderNumber })
  updated.items = updatedItems

  res
    .status(200)
    .json({
      status: 'success',
      byId: updated
    })
})