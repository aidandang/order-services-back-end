const Item = require('../models/itemModel')
const catchAsync = require('../utils/catchAsync')
const AppError = require('../utils/appError')
const { itemAggregate } = require('../utils/aggregation')

exports.readItems = catchAsync(async (req, res, next) => {
  const queryObj = { ...req.query }

  // response all items that matches with the query
  // return error if there is no valid query.
  var match = {}
  var orderNumber = null
  var itemStatus = null
  
  if (queryObj.orderNumber) {
    orderNumber = queryObj.orderNumber.split(',')
    match.orderNumber = {
      $in: parseInt(orderNumber)
    }
  }
  if (queryObj.itemStatus) { 
    itemStatus = queryObj.itemStatus.split(',')
    match.status = {
      $in: itemStatus
    }
  }

  if (Object.keys(match).length === 0) return next(new AppError('No item found.', 404))

  // find items and response to the request if success,
  // items retured would be an empty array if there is no found
  let query = Item.aggregate(itemAggregate(match))

  if (queryObj.sort) {
    query.sort(queryObj.sort.split(',').join(' '))
  } else {
    query.sort('-createdAt')
  }

  const items = await query

  res.status(200).json({
    status: 'success',
    allIds: items
  })
})

exports.readItemById = catchAsync(async (req, res, next) => {
  const id = req.params.id;

  // find item with provided id 
  // and return error if item is not found
  // otherwise return a success response
  const item = await Item.find({ _id: id })

  if (!item) return next(new AppError('No item found.', 404))
  
  res.status(200).json({
    status: 'success',
    byId: item
  });
});

exports.createItem = catchAsync(async (req, res, next) => {
  const obj = { ...req.body }

  // create new item and return a success response
  // with that new item
  const newItem = await Item.create(obj);

  res.status(201).json({
    status: 'success',
    byId: newItem
  });
});

exports.updateItemById = catchAsync(async (req, res, next) => {
  const id = req.params.id;
  const obj = { ...req.body };

  // before updating, the existing item needed to saved
  // as a new revision

  // check if item found, return error if not
  const found = Item.find({ _id: id })

  if (!found) return next(new AppError('No item found.', 404))

  // copy 'rev' (revision) element from found item
  // and create a new revision to this existing item
  // with the key name is a time stamp 
  const rev = { ...found.rev }
  const existingItem = { ...found }
  delete existingItem.rev;

  rev[Date.now()] = { ...existingItem }

  // added the new rev to req body then update,
  // return a success response with updated item
  obj.rev = rev

  const updated = await Item.findByIdAndUpdate(
    id, 
    obj, 
    { new: true, runValidators: true }
  );
  
  res
    .status(200)
    .json({
      status: 'success',
      byId: updated
    });
});