const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId
const Item = require('../models/itemModel')
const Receiving = require('../models/receivingModel');
const catchAsync = require('../utils/catchAsync');

// constants
const WAREHOUSE_NUMBER = 1

exports.readInventory = catchAsync(async (req, res, next) => {
  // find items and response to the request if success,
  // items retured would be an empty array if not found

  // set the query
  const itemAggregate = [
    { 
      $match: {
        warehouseNumber: {
          $eq: WAREHOUSE_NUMBER 
        },
        status: {
          $in: ['ordered', 'received', 'packed']
        }
      }
    },
    {
      $lookup: {
        from: 'warehouses',
        localField: 'warehouseNumber',
        foreignField: 'warehouseNumber',
        as: 'warehouse'
      }      
    },
    {
      $unwind: '$warehouse'
    },
    {
      $lookup: {
        from: 'products',
        localField: 'productNumber',
        foreignField: 'productNumber',
        as: 'product'
      }      
    },
    {
      $unwind: '$product'
    }
  ]

  // get itemss and sort by the orderNumber
  let itemQuery = Item.aggregate(itemAggregate)
  itemQuery = itemQuery.sort('-orderNumber')

  const itemResult = await itemQuery

  // find receiving trackings and response to the request if success,
  // items retured would be an empty array if not found
  
  // set query to get all received trackings
  const receivingAggregate = [{ 
    $match: {
      warehouseNumber: {
        $eq: WAREHOUSE_NUMBER 
      },
      status: {
        $in: ['received', 'checked']
      } 
    }
  }]

  // get trackings and sort by the created date
  let receivingQuery = Receiving.aggregate(receivingAggregate)
  recevingQuery = receivingQuery.sort('-createdAt')

  const receivingResult = await receivingQuery;

  res.status(200).json({
    status: 'success',
    items: itemResult,
    trackings: receivingResult
  });
});

exports.updateReceivedTracking = catchAsync(async (req, res, next) => {
  const { receiving, items } = req.body

  // update multiple docs in "items" collection 
  // using mongoDB -> BuldWrite method

  // initiate values
  const query = []
  var i = 0

  // add update operations to the query
  for (i = 0; i < items.length; i++) {
    query.push({
      updateOne: {
        "filter": { _id: items[i]._id },
        "update": items[i]
      }
    })
  }

  // update items
  await Item.bulkWrite(query)

  // update the received tracking with request Id
  // add processed date, update status and received number
  
  // get the request Id
  const id = req.params.id

  // update the tracking
  await Receiving.findByIdAndUpdate(
    id,
    receiving,
    { runValidators: true}
  )

  res
    .status(200)
    .json({
      status: 'success'
    })
})