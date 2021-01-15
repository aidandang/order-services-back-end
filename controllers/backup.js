const Receiving = require('../models/receivingModel')
const catchAsync = require('../utils/catchAsync')
const AppError = require('../utils/appError')
const { receivingAggregate } = require('../utils/aggregation')
const Revision = require('../models/revisionModel')

exports.createTracking = catchAsync(async (req, res, next) => {
  const newtracking = await Receiving.insertMany(req.body)

  res.status(201).json({
    status: 'success',
    byId: newtracking
  })
})

exports.updateTracking = catchAsync(async (req, res, next) => {
  const id = req.params.id
  
  // before updating, the existing tracking needed to saved
  // as a new revision
  
  // check if order found, return error if not
  const found = await Receiving.findOne({ _id: id })

  if (!found) return next(new AppError('No receiving found.', 404))

  // create a new revision to this existing tracking
  const receivingRev = {
    collectionName: 'receivings',
    documentId: found._id,
    revision: {
      receiving: { ...found }
    }
  }

  await Revision.create(receivingRev)

  // update tracking
  const tracking = await Receiving.findByIdAndUpdate(
    id,
    req.body,
    { new: true, runValidators: true }
  )

  res
    .status(200)
    .json({
      status: 'success',
      byId: tracking
    })
})

exports.deleteTracking = catchAsync(async (req, res, next) => {
  const id = req.params.id
  
  const tracking = await Receiving.findByIdAndDelete(id)

  res
    .status(200)
    .json({
      status: 'success',
      byId: tracking
    })
})