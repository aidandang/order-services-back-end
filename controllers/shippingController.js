const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const Shipping = require('../models/shippingModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const { shippingAggregate } = require('../utils/aggregation');

exports.readShipments = catchAsync(async (req, res, next) => {
  let match = null;

  if (req.query.shptNumber) {
    shptNumber = req.query.shptNumber;
    match = {
      shptNumber: { 
        $eq: parseInt(shptNumber)
      } 
    };  
  } else if (req.query.status) {
    status = req.query.status.split(',');
    match = {
      status: {
        $in: status
      } 
    }
  } else if (req.query.pkupDate) {
    pkupDate = req.query.pkupDate;
    match = {
      '$expr': {
        $regexMatch: {
          input: { $dateToString: { format: "%Y-%m-%d", date: "$pkupDate" } },
          regex: pkupDate,
          options: "i"
        }
      }
    }
  } else if (req.query.shptDate) {
    shptDate = req.query.shptDate;
    match = {
      '$expr': {
        $regexMatch: {
          input: { $dateToString: { format: "%Y-%m-%d", date: "$shptDate" } },
          regex: shptDate,
          options: "i"
        }
      }
    }
  }

  if (match === null) {
    match = {}
  }

  let query = Shipping.aggregate(shippingAggregate(match))

  if (req.query.sort) {
    const sortBy = req.query.sort.split(',').join(' ');
    query = query.sort(sortBy);
  } else {
    query = query.sort('-createdAt');
  }

  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || 6;
  const skip = (page - 1) * limit;

  const arr = await query;
  const count = arr.length;
  const pages = Math.ceil(count/limit);

  query = query.skip(skip).limit(limit);

  const shipments = await query;

  res.status(200).json({
    status: 'success',
    info: {
      count: count,
      pages: pages
    },
    allIds: shipments
  });
});

exports.readShipment = catchAsync(async (req, res, next) => {
  const id = req.params.id;
  const match = { _id: ObjectId(id) }
  const shipment = await Shipping.aggregate(shippingAggregate(match))

  if (shipment.length === 0) {
    return next(new AppError('No shipment found with that Id', 404))
  }
  
  res.status(200).json({
    status: 'success',
    byId: shipment[0]
  });
});

exports.createShipment = catchAsync(async (req, res, next) => {
  const newShipment = await Shipping.create(req.body);

  res.status(201).json({
    status: 'success',
    byId: newShipment
  });
});

exports.updateShipment = catchAsync(async (req, res, next) => {
  const id = req.params.id;
  const queryObj = { ...req.body };

  const updateShipment = await Shipping.findByIdAndUpdate(
    id,
    queryObj,
    { new: true, runValidators: true }
  );

  if (!updateShipment) {
    return next(new AppError('No shipment found with that Id', 404))
  }

  const match = { _id: ObjectId(id) };
  const shipment = await Order.aggregate(orderAggregate(match));

  let rev = {};
  let obj = {};

  if (shipment.length > 0) {
    obj = { ...shipment[0] }
    delete obj.rev;
    rev = { ...shipment[0].rev }
    rev[Date.now()] = { ...obj }
  }

  if (Object.keys(rev).length > 0) {
    await Order.findByIdAndUpdate(
      id,
      { rev }
    )
  }  

  res
    .status(200)
    .json({
      status: 'success',
      byId: shipment[0]
    });
})