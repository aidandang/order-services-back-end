const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const Product = require('../models/productModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const { productAggregate } = require('../utils/aggregation');

exports.readProducts = catchAsync(async (req, res, next) => {
  // delete special keywords in the query
  const queryObj = { ...req.query };
  const excludedFields = ['page', 'sort', 'limit', 'fields'];
  excludedFields.forEach(element => delete queryObj[element]);

  let match = null;

  if (req.query.name) {
    name = req.query.name;
    match = {
      '$expr': {
          $regexMatch: {
          input: "$name",
          regex: name,
          options: "i"
        }
      } 
    };  
  } else if (req.query.styleCode) {
    styleCode = req.query.styleCode;
    match = {
      '$expr': {
        $regexMatch: {
          input: "$styleCode",
          regex: styleCode,
          options: "i"
        } 
      } 
    };  
  }

  if (match === null) {
    match = {}
  }

  let query = Product.aggregate(productAggregate(match))

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
  
  const products = await query;
  
  if (products.length === 0) return next(new AppError('No product found.', 404))

  res.status(200).json({
    status: 'success',
    info: {
      count,
      pages
    },
    allIds: products
  });
});

exports.readProductById = catchAsync(async (req, res, next) => {
  const id = req.params.id;
  const match = { _id: ObjectId(id) }
  const product = await Product.aggregate(productAggregate(match))

  if (product.length === 0) {
    return next(new AppError('No product found with that Id', 404))
  }
  
  res.status(200).json({
    status: 'success',
    byId: product[0]
  });
});

exports.createProduct = catchAsync(async (req, res, next) => {
  const queryObj = {...req.body};
  const newProduct = await Product.create(queryObj);
  res.status(201).json({
    status: 'success',
    byId: newProduct
  });
});

exports.updateProductById = catchAsync(async (req, res, next) => {
  const id = req.params.id;
  const queryObj = {...req.body};

  const updateProduct = await Product.findByIdAndUpdate(
    id, 
    queryObj, 
    { new: true, runValidators: true }
  );

  if (!updateProduct) {
    return next(new AppError('No product found with that Id', 404))
  }

  const match = { _id: ObjectId(id) }
  const product = await Product.aggregate(productAggregate(match))

  res
    .status(200)
    .json({
      status: 'PATCH_SUCCESS',
      byId: product[0]
    });
});

exports.deleteProductById = catchAsync(async (req, res, next) => {
  const result = await Product.findByIdAndDelete(
    req.params.id
  );

  if (!result) {
    return next(new AppError('No product found with that Id', 404))
  }

  res
    .status(200)
    .json({
      status: 'DELETE_SUCCESS',
      product: result
    });
})

exports.addColor = catchAsync(async (req, res, next) => {
  const id = req.params.id;
  const queryObj = req.body;
  const result = await Product.findByIdAndUpdate(
    id, 
    { $push: 
      { "colors": queryObj } 
    }, 
    { new: true, runValidators: true }
  );

  if (!result) {
    return next(new AppError('No product found with that Id', 404))
  }

  const match = { _id: ObjectId(id) }
  const product = await Product.aggregate(productAggregate(match))

  res
    .status(201)
    .json({
      status: 'POST_SUCCESS',
      product: product[0]
    });
});

exports.updateColor = catchAsync(async (req, res, next) => {
  const id = req.params.id;
  const sid = req.params.sid;
  // Get an array of object keys needed to update from req.body.
  const keys = Object.keys(req.body);
  // Assign back value for each key with mongoose syntax: { "items.$.key1" : req.body.key1, "items.$.key2": req.body.key2, ... }
  const updateValues = keys.reduce((acc, curr) => Object.assign(acc, { [`colors.$.${curr}`]: req.body[curr] }), {});
  const result = await Product.findOneAndUpdate(
    { _id: id, "colors._id": sid },
    { $set: updateValues },
    { new: true, safe: true, runValidators: true }
  );

  if (!result) {
    return next(new AppError('No product found with that Id', 404))
  }

  const match = { _id: ObjectId(id) }
  const product = await Product.aggregate(productAggregate(match))

  res
    .status(200)
    .json({
      status: 'PATCH_SUCCESS',
      product: product[0]
    });
});

exports.deleteColor = catchAsync(async (req, res, next) => {
  const id = req.params.id;
  const sid = req.params.sid;

  const result = await Product.findByIdAndUpdate(
    id, 
    { 
      $pull: { 
        "colors": { "_id": sid }
      } 
    },
    { new: true, safe: true }
  );

  const match = { _id: ObjectId(id) }
  const product = await Product.aggregate(productAggregate(match))

  if (!result) {
    return next(new AppError('No product found with that Id', 404))
  }

  res
    .status(200)
    .json({
      status: 'DELETE_SUCCESS',
      product: product[0]
    });
});