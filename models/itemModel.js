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
  unitCost: {
    type: Number,
    required: true
  },
  itemCost: {
    type: Number,
    required: true
  },
  purTaxPct: {
    type: Number,
    required: true,
    default: 0
  },
  weight: {
    type: Number,
    default: 0
  },
  shippingDong: {
    type: Number,
    required: true,
    default: 0
  },
  totalDong: {
    type: Number,
    required: true,
    default: 0
  },
  exRate: {
    type: Number,
    required: true,
    default: 24000
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
    default: 'editing',
    enum: ['editing', 'ordered', 'received', 'shipped', 'delivered'],
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