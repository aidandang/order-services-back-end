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
    enum: ['online', 'walk-in', 'customer']
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
  }
})

const sellingSchema = new Schema({
  customer: {
    type: Object,
    required: true
  },
  itemsPrice: {
    type: Number,
    required: true,
    default: 0
  },
  shippingPrice: {
    type: Number,
    default: 0
  },
  salesTax: {
    type: Number,
    default: 0
  },
  discount: {
    type: Number,
    default: 0
  }
})

const orderSchema = new Schema({
  status: {
    type: String,
    required: true,
    enum: [
      'created', 
      'ordered', 
      'received', 
      'shipped',
      'delivered',
      'returned',
      'processed',
      'cancelled'
    ],
    index: true
  },
  purchasing: {
    type: purchasingSchema
  },
  costing: {
    type: costingSchema
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