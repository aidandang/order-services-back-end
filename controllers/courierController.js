const Courier = require('../models/courierModel');
const catchAsync = require('../utils/catchAsync');

exports.createCourier = catchAsync(async (req, res, next) => {
  const newCourier = await Courier.create(req.body);

  let couriers = null;

  if (newCourier) {
    couriers = await Courier.find().sort('name');
  }

  res.status(201).json({
    status: 'success',
    byId: newCourier,
    allIds: couriers
  });
});

exports.readCouriers = catchAsync(async (req, res, next) => {
  let query = Courier.find();

  if (req.query.sort) {
    const sortBy = req.query.sort.split(',').join(' ');
    query = query.sort(sortBy);
  } else {
    query = query.sort('name');
  }

  const couriers = await query; 

  res.status(200).json({
    status: 'success',
    allIds: couriers
  });
});

exports.updateCourier = catchAsync(async (req, res, next) => {
  const courier = await Courier.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  );

  let couriers = null;

  if (courier) {
    couriers = await Courier.find().sort('name');
  }

  res
    .status(200)
    .json({
      status: 'success',
      byId: courier,
      allIds: couriers
    });
})

exports.deleteCourier = catchAsync(async (req, res, next) => {
  const id = req.params.id;
  
  const courier = await Courier.findByIdAndDelete(id);

  let couriers = null;

  if (courier) {
    couriers = await Courier.find().sort('name');
  }

  res
    .status(200)
    .json({
      status: 'success',
      allIds: couriers
    });
});