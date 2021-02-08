const mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  autoIncrement = require('mongoose-auto-increment')

autoIncrement.initialize(mongoose)

// constants
const WAREHOUSE_NUMBER = 1

const purchasingSchema = new Schema({
  merchant: {
    type: Object,
    required: true
  },
  warehouse: {
    type: Object,
    required: true
  },
  orderNumber: {
    type: String,
    required: true,
    index: true
  },
  orderDate: {
    type: Date,
    required: true
  },
  type: {
    type: String,
    required: true,
    enum: ['online', 'walk-in', 'shipping']
  },
  purSalesTax: {
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
  purDiscount: {
    type: Number,
    default: 0
  }
})

const sellingSchema = new Schema({
  customer: {
    type: Object,
    required: true
  },
  discount: {
    type: Number,
    default: 0
  },
  exRate: {
    type: Number,
    required: true,
    default: 24000
  }
})

const itemSchema = new Schema({
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
  attachments: {
    type: Array
  },
  note: {
    type: String,
    default: ''
  },
  recvTracking: {
    type: String,
    default: ''
  }
})

const orderSchema = new Schema({
  warehouseNumber: {
    type: Number,
    required: true,
    default: WAREHOUSE_NUMBER
  },
  status: {
    type: String,
    required: true,
    enum: [
      'created', 
      'ordered',
      'partial-received',
      'received',
      'shipped',
      'cancel'
    ],
    index: true
  },
  purchasing: {
    type: purchasingSchema
  },
  selling: {
    type: sellingSchema
  },
  items: [itemSchema],
  createdAt: {
    type: Date,
    default: Date.now
  }
})

orderSchema.plugin(autoIncrement.plugin, {
  model: 'Order',
  field: 'orderNumber',
  startAt: 1,
  incrementBy: 1
})

const Order = mongoose.model('Order', orderSchema)

module.exports = Order