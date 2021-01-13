// set query to request customers
exports.getCustomers = (match) => ([
  { 
    $match: match
  }
])