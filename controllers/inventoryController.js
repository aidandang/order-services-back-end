const Item = require('../models/itemModel')
const Receiving = require('../models/receivingModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.readInventory = catchAsync(async (req, res, next) => {
  // find items and response to the request if success,
  // items retured would be an empty array if not found
  // group founds by order number
  let itemQuery = Item.aggregate([
    { 
      $match: {
        status: {
          $in: ['ordered', 'received', 'packed']
        }
      }
    },
    {
      $group: {
        _id: '$orderNumber',
        itemStatus: {
          $push: "$status"
        },
        items: {
          $push: "$$ROOT"
        }
      }
    }
  ])

  const itemResult = await itemQuery
  
  // set query to get all received trackings
  const receivingAggregate = [{ 
    $match: {
      status: {
        $in: ['received', 'checked']
      } 
    }
  }]

  // get trackings and sort by the created date
  let receivingQuery = Receiving.aggregate(receivingAggregate);
  recevingQuery = receivingQuery.sort('createdAt');

  const receivingResult = await receivingQuery;

  res.status(200).json({
    status: 'success',
    orders: itemResult,
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
  // add procDate, update status and receivedNumber
  
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