const Warehouse = require('../models/warehouseModel')
const catchAsync = require('../utils/catchAsync')

exports.createWarehouse = catchAsync(async (req, res, next) => {
  const newWarehouse = await Warehouse.create(req.body)

  // response all ids and byId is the warehouse just created
  var warehouses = null
  if (newWarehouse) {
    warehouses = await Warehouse.find().sort('name')
  }

  res.status(201).json({
    status: 'success',
    allIds: warehouses,
    byId: newWarehouse
  })
})

exports.readWarehouses = catchAsync(async (req, res, next) => {
  var query = Warehouse.find()

  // sort
  if (req.query.sort) {
    const sortBy = req.query.sort.split(',').join(' ')
    query = query.sort(sortBy)
  } else {
    query = query.sort('name')
  }

  const warehouses = await query 

  res.status(200).json({
    status: 'success',
    allIds: warehouses
  })
})

exports.updateWarehouse = catchAsync(async (req, res, next) => {
  const { id } = req.params
  const reqBody = { ...req.body }

  const warehouse = await Warehouse.findByIdAndUpdate(
    id,
    reqBody,
    { new: true, runValidators: true }
  )

  // response all ids and byId the warehouse just updated
  var warehouses = null
  if (warehouse) {
    warehouses = await Warehouse.find().sort('name')
  }

  res.status(200).json({
    status: 'success',
    byId: warehouse,
    allIds: warehouses
  })
})

exports.deleteWarehouse = catchAsync(async (req, res, next) => {
  const { id } = req.params
  
  const warehouse = await Warehouse.findByIdAndDelete(id)

  // response all warehouses left after deleting
  var warehouses = null
  if (warehouse) {
    warehouses = await Warehouse.find().sort('name')
  }

  res.status(200).json({
    status: 'success',
    allIds: warehouses
  })
})