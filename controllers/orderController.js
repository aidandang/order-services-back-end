const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const Order = require('../models/orderModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const { orderAggregate } = require('../utils/aggregation');

exports.createOrder = catchAsync(async (req, res, next) => {
  const newOrder = await Order.create(req.body);
  res.status(201).json({
    status: 'success',
    byId: newOrder
  });
});

exports.readOrders = catchAsync(async (req, res, next) => {
  let match = null;

  if (req.query.orderNumber) {
    orderNumber = req.query.orderNumber;
    match = {
      orderNumber: { 
        $eq: parseInt(orderNumber)
      } 
    };  
  }

  if (match === null) {
    match = {}
  }

  let query = Order.aggregate(orderAggregate(match))

  if (req.query.sort) {
    const sortBy = req.query.sort.split(',').join(' ');
    query = query.sort(sortBy);
  } else {
    query = query.sort('-createdAt');
  }

  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || 20;
  const skip = (page - 1) * limit;

  const arr = await query;
  const count = arr.length;
  const pages = Math.ceil(count/limit);

  query = query.skip(skip).limit(limit);
  
  const orders = await query;

  if (orders.length === 0) return next(new AppError('No order found.', 404))

  res.status(200).json({
    status: 'success',
    info: {
      count,
      pages
    },
    allIds: orders
  });
});

exports.readOrderById = catchAsync(async (req, res, next) => {
  const id = req.params.id;
  const match = { _id: ObjectId(id) }
  const order = await Order.aggregate(orderAggregate(match))

  if (order.length === 0) {
    return next(new AppError('No order found with that Id', 404))
  }
  
  res.status(200).json({
    status: 'success',
    byId: order[0]
  });
});

exports.updateOrderById = catchAsync(async (req, res, next) => {
  const id = req.params.id;
  const queryObj = {...req.body};

  const updateOrder = await Order.findByIdAndUpdate(
    id, 
    queryObj, 
    { new: true, runValidators: true }
  );

  if (!updateOrder) {
    return next(new AppError('No product found with that Id', 404))
  }

  const match = { _id: ObjectId(id) }
  const order = await Order.aggregate(orderAggregate(match))

  res
    .status(200)
    .json({
      status: 'success',
      byId: order[0]
    });
});