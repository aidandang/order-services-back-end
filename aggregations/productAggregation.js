// set query to request products
exports.getProducts = (match) => ([
  { 
    $match: match
  }
])