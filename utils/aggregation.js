exports.productAggregate = (match) => ([
  { 
    $match: match
  }
])

exports.orderAggregate = (match) => ([
  { 
    $match: match
  }
])