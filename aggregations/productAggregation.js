const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId

// set query to request products
exports.getProducts = (match) => ([
  { 
    $match: match
  }
])