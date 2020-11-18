const Warehouse = require('../models/warehouseModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.readWarehouses = catchAsync(async (req, res, next) => {
  let query = Warehouse.find();

  if (req.query.sort) {
    const sortBy = req.query.sort.split(',').join(' ');
    query = query.sort(sortBy);
  } else {
    query = query.sort('name');
  }

  const warehouses = await query; 

  res.status(200).json({
    status: 'success',
    allIds: warehouses
  });
});

exports.createWarehouse = catchAsync(async (req, res, next) => {
  const newWarehouse = await Warehouse.create(req.body);

  let warehouses = null;

  if (newWarehouse) {
    warehouses = await Warehouse.find().sort('name');
  }

  res.status(201).json({
    status: 'success',
    byId: newWarehouse,
    allIds: warehouses
  });
});

exports.updateWarehouse = catchAsync(async (req, res, next) => {
  const warehouse = await Warehouse.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  );

  let warehouses = null;

  if (warehouse) {
    warehouses = await Warehouse.find().sort('name');
  }

  res
    .status(200)
    .json({
      status: 'success',
      byId: warehouse,
      allIds: warehouses
    });
})

exports.deleteWarehouse = catchAsync(async (req, res, next) => {
  const id = req.params.id;
  
  const warehouse = await Warehouse.findByIdAndDelete(id);

  let warehouses = null;

  if (warehouse) {
    warehouses = await Warehouse.find().sort('name');
  }

  res
    .status(200)
    .json({
      status: 'success',
      allIds: warehouses
    });
});