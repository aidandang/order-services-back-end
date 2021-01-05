const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId

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
  },
  { 
    $unwind: {
      path: '$items',
      preserveNullAndEmptyArrays: true
    }
  },
  {
    $lookup: {
      from: 'products',
      localField: 'items.productNumber',
      foreignField: 'productNumber',
      as: 'items.product'
    }
  },
  { 
    $unwind: {
      path: '$items.product',
      preserveNullAndEmptyArrays: true
    }
  },
  {
    $group: {
      _id: '$_id',
      root: { 
        $mergeObjects: '$$ROOT' 
      },
      items: { $push: '$items' }
    }
  },
  {
    $replaceRoot: {
      newRoot: {
        $mergeObjects: ['$root', '$$ROOT']
      }
    }
  },
  {
    $project: {
      root: 0
    }
  }
])