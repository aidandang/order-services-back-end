const Receiving = require('../models/receivingModel')
const catchAsync = require('../utils/catchAsync')
const { getReceivings } = require('../aggregations/receivingAggregation')

exports.createReceiving = catchAsync(async (req, res, next) => {
  const reqBody = [ ...req.body ]

  // create
  await Receiving.insertMany(reqBody)

  // response
  res.status(201).json({
    status: 'success'
  })
})

exports.readReceivings = catchAsync(async (req, res, next) => {
  const { tracking, status, receivedDate, processedDate, returnedDate } = req.query
  
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
  } else if (receivedDate) {
    match = {
      '$expr': {
        $regexMatch: {
          input: { $dateToString: { format: "%Y-%m-%d", date: "$receivedDate" } },
          regex: receivedDate,
          options: "i"
        }
      }
    }
  } else if (processedDate) {
    match = {
      '$expr': {
        $regexMatch: {
          input: { $dateToString: { format: "%Y-%m-%d", date: "$processedDate" } },
          regex: processedDate,
          options: "i"
        }
      }
    }
  } else if (returnedDate) {
    match = {
      '$expr': {
        $regexMatch: {
          input: { $dateToString: { format: "%Y-%m-%d", date: "$returnedDate" } },
          regex: returnedDate,
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
    query = query.sort('-receivedDate')
  }

  // pagination
  const page = req.query.page * 1 || 1
  const limit = req.query.limit * 1 || 10
  const skip = (page - 1) * limit

  const arr = await query
  const count = arr.length
  const pages = Math.ceil(count/limit)

  query = query.skip(skip).limit(limit)

  const receivings = await query

  res.status(200).json({
    status: 'success',
    info: {
      count: count,
      pages: pages
    },
    allIds: receivings
  })
})

exports.readReceivingById = catchAsync(async (req, res, next) => {
  const { id } = req.params
  
  const receiving = await Receiving.findById(id)
  
  res.status(200).json({
    status: 'success',
    byId: receiving
  })
})

exports.updateReceiving = catchAsync(async (req, res, next) => {
  const { id } = req.params
  const reqBody = req.body

  // update tracking
  const receiving = await Receiving.findByIdAndUpdate(
    id,
    reqBody,
    { new: true, runValidators: true }
  )

  res.status(200).json({
    status: 'success',
    byId: receiving
  })
})