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
    name = req.query.name;
    match = {
      '$expr': {
          $regexMatch: {
          input: "$tracking",
          regex: name,
          options: "i"
        }
      } 
    };  
  } else if (req.query.orderRef) {
    orderRef = req.query.orderRef;
    match = {
      '$expr': {
        $regexMatch: {
          input: "$orderRef",
          regex: orderRef,
          options: "i"
        } 
      } 
    };  
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

  query = query.skip(skip).limit(limit);

  const trackings = await query; 

  if (trackings.length === 0) return next(new AppError('No tracking found.', 404))

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
  const newtracking = await Receiving.create(req.body);

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