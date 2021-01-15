// set query to request receivings
exports.getReceivings = (match) => ([
  { 
    $match: match
  }
])