const Receiving = require('../models/receivingModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const { receivingAggregate } = require('../utils/aggregation');

exports.readTrackings = catchAsync(async (req, res, next) => {
  // delete special keywords in the query
  const queryObj = { ...req.query };
  const excludedFields = ['page', 'sort', 'limit', 'fields'];
  excludedFields.forEach(element => delete queryObj[element]);

  let match = null;

  if (req.query.tracking) {
    tracking = req.query.tracking;
    match = {
      '$expr': {
          $regexMatch: {
          input: "$tracking",
          regex: tracking,
          options: "i"
        }
      } 
    };  
  } else if (req.query.status) {
    status = req.query.status;
    match = {
      '$expr': {
        $regexMatch: {
          input: "$status",
          regex: status,
          options: "i"
        } 
      } 
    };  
  } else if (req.query.recvDate) {
    recvDate = req.query.recvDate;
    match = {
      '$expr': {
        $regexMatch: {
          input: { $dateToString: { format: "%Y-%m-%d", date: "$recvDate" } },
          regex: recvDate,
          options: "i"
        }
      }
    }
  }

  if (match === null) {
    match = {}
  }

  let query = Receiving.aggregate(receivingAggregate(match))

  if (req.query.sort) {
    const sortBy = req.query.sort.split(',').join(' ');
    query = query.sort(sortBy);
  } else {
    query = query.sort('createdAt');
  }

  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || 6;
  const skip = (page - 1) * limit;

  const arr = await query;
  const count = arr.length;
  const pages = Math.ceil(count/limit);

  query = query.skip(skip).limit(limit);

  const trackings = await query;

  res.status(200).json({
    status: 'success',
    info: {
      count: count,
      pages: pages
    },
    allIds: trackings
  });
});

exports.createTracking = catchAsync(async (req, res, next) => {
  const newtracking = await Receiving.insertMany(req.body);

  res.status(201).json({
    status: 'success',
    byId: newtracking
  });
});

exports.updateTracking = catchAsync(async (req, res, next) => {
  const tracking = await Receiving.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  );

  res
    .status(200)
    .json({
      status: 'success',
      byId: tracking
    });
})

exports.deleteTracking = catchAsync(async (req, res, next) => {
  const id = req.params.id;
  
  const tracking = await Receiving.findByIdAndDelete(id);

  res
    .status(200)
    .json({
      status: 'success',
      byId: tracking
    });
});