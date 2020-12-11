const mongoose = require('mongoose'),
  Schema = mongoose.Schema

const costSchema = new Schema({
  itemCost: {
    type: Number,
    required: true
  },
  salesTax: {
    type: Number,
    default: 0
  },
  shippingCost: {
    type: Number,
    default: 0
  },
  otherCost: {
    type: Number,
    default: 0
  },
  totalCost: {
    type: Number,
    required: true
  }
})

const priceSchema = new Schema({
  itemPrice: {
    type: Number,
    required: true
  },
  salesTax: {
    type: Number,
    default: 0
  },
  shippingPrice: {
    type: Number,
    default: 0
  },
  totalPrice: {
    type: Number,
    required: true,
    default: 0
  }
})

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
  weight: {
    type: Number,
    default: 0
  },
  cost: {
    type: costSchema
  },
  price: {
    type: priceSchema
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