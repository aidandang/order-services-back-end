const Customer = require('../models/customerModel');
const APIFeatures = require('../utils/apiFeatures');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.readCustomers = catchAsync(async (req, res, next) => {

  // set default limit documents per page
  const defaultLimit = 10;
  const defaultPage = 1;

  // request the query after filtering to count a number of documents
  const features = new APIFeatures(
    Customer.find(), 
    req.query, 
    defaultLimit, 
    defaultPage)
    .filter();
  const arr = await features.query;
  const count = arr.length;
  
  // request the query after sorting, limiting and paginating
  features.sort().limitFields().paginate();
  const customers = await features.query;

  // get pages and num of docs
  const limit = features.limit;
  const pages = Math.ceil(count/limit);

  if (customers.length === 0) return next(new AppError('No customer found.', 404))

  res
    .status(200)
    .json({
      status: 'success',
      info: {
        count: count,
        pages: pages
      },
      allIds: customers
    });
});

exports.readCustomerById = catchAsync(async (req, res, next) => {
  const customer = await Customer.findById(req.params.id);

  if (!customer) {
    return next(new AppError('No customer found with that Id', 404))
  }
  
  res
    .status(200)
    .json({
      status: 'success',
      byId: customer
    });
});

exports.createCustomer = catchAsync(async (req, res, next) => {
  const newCustomer = await Customer.create(req.body);
  res
    .status(201)
    .json({
      status: 'success',
      byId: newCustomer
    });
});

exports.addShippingInfo = catchAsync(async (req, res, next) => {
  const result = await Customer.findByIdAndUpdate(
    req.params.id, 
    { $push: 
      { "shippingInfo": req.body } 
    }, 
    { new: true, runValidators: true }
  );
  res
    .status(201)
    .json({
      status: 'success',
      byId: result
    });
});

exports.deleteShippingInfo = catchAsync(async (req, res, next) => {
  const id = req.params.id;
  const sid = req.params.sid;
  
  const result = await Customer.findByIdAndUpdate(
    id, 
    { 
      $pull: { 
        "shippingInfo": { "_id": sid } 
      } 
    },
    { new: true, safe: true }
  );

  if (!result) {
    return next(new AppError('No customer found with that Id', 404))
  }

  res
    .status(200)
    .json({
      status: 'DELETE_SUCCESS',
      byId: result
    });
});

exports.updateShippingInfo = catchAsync(async (req, res, next) => {
  // Get an array of object keys needed to update from req.body.
  const keys = Object.keys(req.body);
  // Assign back value for each key with mongoose syntax: { "items.$.key1" : req.body.key1, "items.$.key2": req.body.key2, ... }
  const updateValues = keys.reduce((acc, curr) => Object.assign(acc, { [`shippingInfo.$.${curr}`]: req.body[curr] }), {});
  const result = await Customer.findOneAndUpdate(
    { _id: req.params.id, "shippingInfo._id": req.params.sid },
    { $set: updateValues },
    { new: true, safe: true, runValidators: true }
  );
  res
    .status(201)
    .json({
      status: 'success',
      byId: result
    });
});

exports.updateCustomer = catchAsync(async (req, res, next) => {
  const customer = await Customer.findByIdAndUpdate(
    req.params.id, 
    req.body, 
    { new: true, runValidators: true }
  );
  res
    .status(200)
    .json({
      status: 'success',
      byId: customer
    });
});

exports.deleteCustomer = catchAsync(async (req, res, next) => {
  const result = await Customer.findByIdAndDelete(
    req.params.id,
    { new: true, safe: true }
  );
  res
    .status(204)
    .json({
      status: 'success',
      byId: result
    });
});