const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId

// set query to request customers
exports.getCustomers = (match) => ([
  { 
    $match: match
  }
])