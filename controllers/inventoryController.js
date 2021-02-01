const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId
const Order = require('../models/orderModel')
const Receiving = require('../models/receivingModel');
const catchAsync = require('../utils/catchAsync');

// constants
const WAREHOUSE_NUMBER = 1

exports.readInventory = catchAsync(async (req, res, next) => {
  // find items and response to the request if success,
  // items retured would be an empty array if not found

  // set the query
  const orderAggregate = [
    { 
      $match: {
        warehouseNumber: {
          $eq: WAREHOUSE_NUMBER 
        },
        status: {
          $in: ['ordered', 'received']
        }
      }
    }
  ]

  // get orders
  let orderQuery = Order.aggregate(orderAggregate)
  orderQuery = orderQuery.sort('-createdAt')

  const orderResult = await orderQuery

  // find receiving trackings and response to the request if success,
  // items retured would be an empty array if not found
  
  // set query to get all received trackings
  const receivingAggregate = [{ 
    $match: {
      warehouseNumber: {
        $eq: WAREHOUSE_NUMBER 
      },
      status: {
        $in: ['received', 'checked']
      } 
    }
  }]

  // get trackings and sort by the created date
  let receivingQuery = Receiving.aggregate(receivingAggregate)
  recevingQuery = receivingQuery.sort('-createdAt')

  const receivingResult = await receivingQuery;

  res.status(200).json({
    status: 'success',
    orders: orderResult,
    trackings: receivingResult
  });
});

exports.updateReceivedTrackingCheck = catchAsync(async (req, res, next) => {
  const { id } = req.params
  const reqBody = req.body

  // update tracking
  await Receiving.findByIdAndUpdate(
    id,
    reqBody,
    { runValidators: true }
  )

  res.status(200).json({
    status: 'success'
  })
})

exports.updateReceivedTrackingProcess = catchAsync(async (req, res, next) => {
  const { receiving, items } = req.body

  // update multiple docs in "items" collection 
  // using mongoDB -> BuldWrite method

  // initiate values
  const query = []
  var i = 0

  // add update operations to the query
  for (i = 0; i < items.length; i++) {
    query.push({
      updateOne: {
        "filter": { _id: items[i]._id },
        "update": items[i]
      }
    })
  }

  // update items
  await Item.bulkWrite(query)

  // update the received tracking with request Id
  // add processed date, update status and received number
  
  // get the request Id
  const id = req.params.id

  // update the tracking
  await Receiving.findByIdAndUpdate(
    id,
    receiving,
    { runValidators: true}
  )

  res.status(200).json({
    status: 'success'
  })
})