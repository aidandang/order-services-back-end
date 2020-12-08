const Consignee = require('../models/consigneeModel');
const catchAsync = require('../utils/catchAsync');

exports.createConsignee = catchAsync(async (req, res, next) => {
  const newConsignee = await Consignee.create(req.body);

  let consignees = null;

  if (newConsignee) {
    consignees = await Consignee.find().sort('name');
  }

  res.status(201).json({
    status: 'success',
    byId: newConsignee,
    allIds: consignees
  });
});

exports.readConsignees = catchAsync(async (req, res, next) => {
  let query = Consignee.find();

  if (req.query.sort) {
    const sortBy = req.query.sort.split(',').join(' ');
    query = query.sort(sortBy);
  } else {
    query = query.sort('name');
  }

  const consignees = await query; 

  res.status(200).json({
    status: 'success',
    allIds: consignees
  });
});

exports.updateConsignee = catchAsync(async (req, res, next) => {
  const consignee = await Consignee.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  );

  let consignees = null;

  if (consignee) {
    consignees = await Consignee.find().sort('name');
  }

  res
    .status(200)
    .json({
      status: 'success',
      byId: consignee,
      allIds: consignees
    });
})

exports.deleteConsignee = catchAsync(async (req, res, next) => {
  const id = req.params.id;
  
  const consignee = await Consignee.findByIdAndDelete(id);

  let consignees = null;

  if (consignee) {
    consignees = await Consignee.find().sort('name');
  }

  res
    .status(200)
    .json({
      status: 'success',
      allIds: consignees
    });
});