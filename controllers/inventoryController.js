const Order = require('../models/orderModel');
const Receiving = require('../models/receivingModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const { orderAggregate, receivingAggregate } = require('../utils/aggregation');

exports.readInventory = catchAsync(async (req, res, next) => {
  let match = null;

  if (req.query.orderStatus) {
    status = req.query.orderStatus.split(',');
    match = {
      status: {
        $in: status
      } 
    }
  } else {
    return next(new AppError('No Information Found.', 404))
  }

  if (match === null) {
    match = {}
  }

  let orders = Order.aggregate(orderAggregate(match));
  orders = orders.sort('-createdAt');

  const orderResult = await orders;
  match = null;
  
  if (req.query.receivingStatus) {
    status = req.query.receivingStatus;
    match = {
      '$expr': {
        $regexMatch: {
          input: "$status",
          regex: status,
          options: "i"
        } 
      } 
    }; 
  } else {
    return next(new AppError('No Information Found.', 404))
  }
  
  if (match === null) {
    match = {}
  }

  let trackings = Receiving.aggregate(receivingAggregate(match));
  trackings = trackings.sort('createdAt');

  const receivingResult = await trackings;

  res.status(200).json({
    status: 'success',
    orders: orderResult,
    trackings: receivingResult
  });
});