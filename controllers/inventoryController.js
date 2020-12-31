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
          $in: ['ordered']
        }
      }
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