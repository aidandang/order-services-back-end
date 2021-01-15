const Receiving = require('../models/receivingModel')
const catchAsync = require('../utils/catchAsync')
const { getReceivings } = require('../aggregations/receivingAggregation')

exports.createTracking = catchAsync(async (req, res, next) => {
  const reqBody = [ ...req.body ]

  // create
  const newtracking = await Receiving.insertMany(reqBody)

  // response
  res.status(201).json({
    status: 'success',
    byId: newtracking
  })
})

exports.readTrackings = catchAsync(async (req, res, next) => {
  const { tracking, status, recvDate, procDate } = req.query
  
  var match = null

  if (tracking) {
    match = {
      '$expr': {
          $regexMatch: {
          input: "$tracking",
          regex: tracking,
          options: "i"
        }
      } 
    }  
  } else if (status) {
    match = {
      '$expr': {
        $regexMatch: {
          input: "$status",
          regex: status,
          options: "i"
        } 
      } 
    }  
  } else if (recvDate) {
    match = {
      '$expr': {
        $regexMatch: {
          input: { $dateToString: { format: "%Y-%m-%d", date: "$recvDate" } },
          regex: recvDate,
          options: "i"
        }
      }
    }
  } else if (procDate) {
    match = {
      '$expr': {
        $regexMatch: {
          input: { $dateToString: { format: "%Y-%m-%d", date: "$procDate" } },
          regex: procDate,
          options: "i"
        }
      }
    }
  }

  if (match === null) {
    match = {}
  }

  // set query
  var query = Receiving.aggregate(getReceivings(match))

  // sort
  if (req.query.sort) {
    const sortBy = req.query.sort.split(',').join(' ')
    query = query.sort(sortBy)
  } else {
    query = query.sort('-recvDate')
  }

  // pagination
  const page = req.query.page * 1 || 1
  const limit = req.query.limit * 1 || 10
  const skip = (page - 1) * limit

  const arr = await query
  const count = arr.length
  const pages = Math.ceil(count/limit)

  query = query.skip(skip).limit(limit)

  const trackings = await query

  res.status(200).json({
    status: 'success',
    info: {
      count: count,
      pages: pages
    },
    allIds: trackings
  })
})

exports.updateTracking = catchAsync(async (req, res, next) => {
  const { id } = req.params
  const reqBody = req.body

  // update tracking
  const tracking = await Receiving.findByIdAndUpdate(
    id,
    reqBody,
    { new: true, runValidators: true }
  )

  res.status(200).json({
    status: 'success',
    byId: tracking
  })
})