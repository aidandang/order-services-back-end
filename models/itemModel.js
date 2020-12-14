const mongoose = require('mongoose'),
  Schema = mongoose.Schema

const itemSchema = new Schema({
  orderNumber: {
    type: Number,
    required: true,
    index: true
  },
  product: {
    type: Object,
    required: true
  },
  color: {
    type: Object,
    required: true
  },
  size: {
    type: String,
    default: ''
  },
  qty: {
    type: Number,
    required: true
  },
  cost: {
    type: Number,
    required: true
  },
  weight: {
    type: Number,
    default: 0
  },
  price: {
    type: Number,
    required: true
  },
  shippingPrice: {
    type: Number,
    required: true
  },
  receivingNumber: {
    type: String,
    default: ''
  },
  shippingNumber: {
    type: String,
    default: ''
  },
  status: {
    type: String,
    required: true,
    default: 'ordered',
    enum: ['ordered', 'received', 'shipped', 'delivered'],
    index: true
  },
  attachments: {
    type: Array
  },
  note: {
    type: String,
    default: ''
  }
})

const Item = mongoose.model('Item', itemSchema)

module.exports = Item