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

exports.receivingAggregate = (match) => ([
  { 
    $match: match
  }
])

exports.shippingAggregate = (match) => ([
  { 
    $match: match
  }
])