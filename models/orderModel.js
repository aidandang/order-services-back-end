const mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  autoIncrement = require('mongoose-auto-increment');

autoIncrement.initialize(mongoose);

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
  }
})

const costingSchema = new Schema({
  salesTax: {
    type: Number,
    default: 0
  },
  otherCost: {
    type: Number,
    default: 0
  },
  totalCost: {
    type: Number,
    required: true,
    default: 0
  },
  paidAmount: {
    type: Number,
    required: true,
    default: 0
  }
})

const sellingSchema = new Schema({
  customer: {
    type: Object,
    required: true
  },
  shippingPrice: {
    type: Number,
    required: true,
    default: 0
  },
  salesTax: {
    type: Number,
    default: 0
  },
  discount: {
    type: Number,
    default: 0
  },
  totalPrice: {
    type: Number,
    required: true,
    default: 0
  },
  exRate: {
    type: Number,
    required: true,
    default: 24000
  }
})

const orderSchema = new Schema({
  status: {
    type: String,
    required: true,
    enum: [
      'created',
      'editing', 
      'ordered'
    ],
    index: true
  },
  purchasing: {
    type: purchasingSchema
  },
  costing: {
    type: costingSchema,
    required: true
  },
  selling: {
    type: sellingSchema
  },
  attachments: {
    type: Array
  },
  rev: {
    type: Object
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  createdBy: {
    type: Object
  }
});

orderSchema.plugin(autoIncrement.plugin, {
  model: 'Order',
  field: 'orderNumber',
  startAt: 1,
  incrementBy: 1
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;