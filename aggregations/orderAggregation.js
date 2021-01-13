const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId

// set order aggregate query to request all ids
exports.getOrders = (match) => ([
  { 
    $match: match
  }
])

// set order aggregate query to request an order by Id
exports.getByIdAggr = (id) => ([
  { 
    $match: {
      _id: ObjectId(id)
    } 
  },
  {
    $lookup: {
      from: 'items',
      localField: 'orderNumber',
      foreignField: 'orderNumber',
      as: 'items'
    }      
  }
])