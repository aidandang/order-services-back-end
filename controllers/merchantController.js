const Merchant = require('../models/merchantModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.readMerchants = catchAsync(async (req, res, next) => {
  let query = Merchant.find();

  if (req.query.sort) {
    const sortBy = req.query.sort.split(',').join(' ');
    query = query.sort(sortBy);
  } else {
    query = query.sort('name');
  }

  const merchants = await query; 

  res.status(200).json({
    status: 'success',
    allIds: merchants
  });
});

exports.createMerchant = catchAsync(async (req, res, next) => {
  const newMerchant = await Merchant.create(req.body);

  let merchants = null;

  if (newMerchant) {
    merchants = await Merchant.find().sort('name');
  }

  res.status(201).json({
    status: 'success',
    byId: newMerchant,
    allIds: merchants
  });
});

exports.updateMerchant = catchAsync(async (req, res, next) => {
  const merchant = await Merchant.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  );

  let merchants = null;

  if (merchant) {
    merchants = await Merchant.find().sort('name');
  }

  res
    .status(200)
    .json({
      status: 'PATCH_SUCCESS',
      byId: merchant,
      allIds: merchants
    });
})

exports.deleteMerchant = catchAsync(async (req, res, next) => {
  const id = req.params.id;
  
  const merchant = await Merchant.findByIdAndDelete(id);

  let merchants = null;

  if (merchant) {
    merchants = await Merchant.find().sort('name');
  }

  res
    .status(200)
    .json({
      status: 'DELETE_SUCCESS',
      allIds: merchants
    });
});