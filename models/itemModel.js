const mongoose = require('mongoose'),
  Schema = mongoose.Schema

const itemSchema = new Schema({
  warehouseNumber: {
    type: Number,
    required: true,
    index: true
  },
  recvTracking: {
    type: String,
    required: true
  },
  recvDate: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    required: true,
    default: 'received',
    enum: ['received', 'packed', 'shipped', 'delivered', 'returned'],
    index: true
  },
  orderNumber: {
    type: Number,
    index: true
  },
  itemRef: {
    type: Object
  },
  attachments: {
    type: Array
  },
  note: {
    type: String
  }
})

const Item = mongoose.model('Item', itemSchema)

module.exports = Item