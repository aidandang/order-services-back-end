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

const receivingSchema = new Schema({
  status: {
    type: String,
    require: true
  },
  tracking: {
    type: String,
    default: ''
  },
  recvDate: {
    type: String,
    default: ''
  },
  warehouse: {
    type: Object,
    require: true
  }
})

const statusSchema = new Schema({
  type: {
    type: String,
    required: true,
    default: 'created',
    enum: ['created', 'ordered', 'received', 'shipped', 'delivered', 'cancelled']
  },
  date: {
    type: Date,
    required: true,
    default: Date.now
  },
  code: {
    type: String,
    required: true,
    default: 'na'
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
  receiving: {
    type: receivingSchema
  },
  customer: {
    type: Object,
    required: true
  },
  status: {
    type: statusSchema
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