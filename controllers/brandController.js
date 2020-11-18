const Brand = require('../models/brandModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.readBrands = catchAsync(async (req, res, next) => {
  let query = Brand.find();

  if (req.query.sort) {
    const sortBy = req.query.sort.split(',').join(' ');
    query = query.sort(sortBy);
  } else {
    query = query.sort('name');
  }

  const brands = await query;

  res.status(200).json({
    status: 'success',
    allIds: brands
  });
});

exports.createBrand = catchAsync(async (req, res, next) => {
  const newBrand = await Brand.create(req.body);

  let brands = null;

  if (newBrand) {
    brands = await Brand.find().sort('name');
  }

  res.status(201).json({
    status: 'success',
    byId: newBrand,
    allIds: brands
  });
});

exports.updateBrand = catchAsync(async (req, res, next) => {
  const brand = await Brand.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  );

  let brands = null;

  if (brand) {
    brands = await Brand.find().sort('name');
  }

  res
    .status(200)
    .json({
      status: 'PATCH_SUCCESS',
      byId: brand,
      allIds: brands
    });
})

exports.deleteBrand = catchAsync(async (req, res, next) => {
  const id = req.params.id;
  
  const brand = await Brand.findByIdAndDelete(id);

  let brands = null;

  if (brand) {
    brands = await Brand.find().sort('name');
  }

  res
    .status(200)
    .json({
      status: 'DELETE_SUCCESS',
      allIds: brands
    });
});