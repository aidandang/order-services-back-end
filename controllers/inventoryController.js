const Order = require('../models/orderModel');
const Receiving = require('../models/receivingModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.readInventory = catchAsync(async (req, res, next) => {

  // set query to get all ordereds
  const orderAggregate = [{ 
    $match: {
      status: {
        $in: ['ordered']
      } 
    }
  }]

  // get orders and sort by the created date
  let orders = Order.aggregate(orderAggregate);
  orders = orders.sort('-createdAt');

  const orderResult = await orders;

  // set query to get all received trackings
  const receivingAggregate = [{ 
    $match: {
      status: {
        $in: ['received']
      } 
    }
  }]

  // get trackings and sort by the created date
  let trackings = Receiving.aggregate(receivingAggregate);
  trackings = trackings.sort('createdAt');

  const receivingResult = await trackings;

  res.status(200).json({
    status: 'success',
    orders: orderResult,
    trackings: receivingResult
  });
});