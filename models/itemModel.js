const mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  autoIncrement = require('mongoose-auto-increment')

autoIncrement.initialize(mongoose)

const itemSchema = new Schema({
  orderNumber: {
    type: Number,
    required: true,
    index: true
  },
  productId: {
    type: String,
    required: true,
    index: true
  },
  warehouseId: {
    type: String,
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
  unitDong: {
    type: Number,
    default: 0
  },
  unitShippingDong: {
    type: Number,
    default: 0
  },
  shippingDong: {
    type: Number,
    default: 0
  },
  exRate: {
    type: Number,
    required: true,
    default: 24000
  },
  receivingNumber: {
    type: String
  },
  recvDate: {
    type: Date
  },
  shippingNumber: {
    type: String,
    default: ''
  },
  status: {
    type: String,
    required: true,
    default: 'editing',
    enum: ['editing', 'ordered', 'received', 'packed', 'shipped', 'delivered'],
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

itemSchema.plugin(autoIncrement.plugin, {
  model: 'Item',
  field: 'itemNumber',
  startAt: 8,
  incrementBy: 1
});

const Item = mongoose.model('Item', itemSchema)

module.exports = Item