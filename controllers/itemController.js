const Item = require('../models/itemModel')
const catchAsync = require('../utils/catchAsync')
const AppError = require('../utils/appError')
const { itemAggregate } = require('../utils/aggregation')
const Revision = require('../models/revisionModel')

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
      $in: orderNumber
    }
  } else if (queryObj.itemStatus) { 
    itemStatus = queryObj.itemStatus.split(',')
    match.status = {
      $in: itemStatus
    }
  }

  if (Object.keys(match).length === 0) return next(new AppError('No item found.', 404))

  // find items and response to the request if success,
  // items retured would be an empty array if not found
  let query = Item.aggregate([
    { 
      $match: match 
    },
    {
      $group: {
        _id: '$orderNumber',
        items: {
          $push: "$$ROOT"
        }
      }
    }
  ])

  // if (queryObj.sort) {
  //   query = query.sort(queryObj.sort.split(',').join(' '))
  // } else {
  //   query = query.sort('-createdAt')
  // }
  
  // query = query.group({
  //   'orderNumber': '$orderNumber'
  // })

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

exports.updateItem = catchAsync(async (req, res, next) => {
  const id = req.params.id;
  const obj = { ...req.body };

  // before updating, the existing item needed to saved
  // as a new revision

  // check if item found, return error if not
  const found = await Item.findOne({ _id: id })

  if (!found) return next(new AppError('No item found.', 404))

  // create a new revision to this existing item
  // const itemRev = {
  //   collectionName: 'items',
  //   documentId: found._id,
  //   revision: {
  //     item: { ...found }
  //   }
  // }
  // await Revision.create(itemRev)

  // update item
  const updated = await Item.findByIdAndUpdate(
    id, 
    obj, 
    { new: true, runValidators: true }
  )
  
  res
    .status(200)
    .json({
      status: 'success',
      byId: updated
    })
})