const mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  autoIncrement = require('mongoose-auto-increment');

autoIncrement.initialize(mongoose);

const infoSchema = new Schema({
  merchant: {
    type: Object,
    required: true
  },
  orderNumber: {
    type: String,
    required: true
  },
  orderDate: {
    type: Date,
    required: true
  },
  orderType: {
    type: String,
    required: true
  },
  warehouse: {
    type: Object,
    required: true
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
    default: 'one-size'
  },
  qty: {
    type: Number,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  salePrice: {
    type: Number,
    default: 0
  },
  weight: {
    type: Number,
    default: 0
  },
  shippingPrice: {
    type: Number,
    default: 0
  },
  note: {
    type: String
  },
  tracking: {
    type: String
  } 
});

const costSchema = new Schema({
  shippingCost: {
    type: Number,
    default: 0
  },
  saleTax: {
    type: Number,
    default: 0
  }
})

const orderSchema = new Schema({
  info: {
    type: infoSchema
  },
  items: {
    type: [itemSchema]
  },
  cost: {
    type: costSchema
  },
  customer: {
    type: Object,
    required: true
  },
  status: {
    type: String,
    required: true,
    default: 'created',
    enum: [
      'created', 
      'ordered', 
      'partially-received', 
      'received', 
      'parcially-shipped', 
      'shipped',
      'parcially-delivered', 
      'delivered', 
      'cancelled'
    ]
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  attachments: {
    type: Array
  },
  createdBy: {
    type: Object
  },
  rev: {
    type: Object
  }
});

orderSchema.plugin(autoIncrement.plugin, {
  model: 'Order',
  field: 'orderRef',
  startAt: 1,
  incrementBy: 1
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;