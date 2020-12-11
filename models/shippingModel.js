const mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  autoIncrement = require('mongoose-auto-increment');

autoIncrement.initialize(mongoose);

const infoSchema = new Schema({
  warehouse: {
    type: Object,
    required: true
  },
  consignee: {
    type: Object,
    required: true
  },
  courier: {
    type: Object,
    required: true
  },
  shptRef: {
    type: String
  },
  shptDate: {
    type: Date,
    required: true
  },
  pkupDate: {
    type: Date,
    required: true
  },
  dlvdDate: {
    type: Date
  },
  weight: {
    type: Number,
    default: 0
  }
})

const itemSchema = new Schema({
  ordrNumber: {
    type: String,
    required: true
  },
  ordrRef: {
    type: String,
    required: true
  },
  item: {
    type: Object,
    required: true
  }
})

const costSchema = new Schema({
  shptCost: {
    type: Number,
    default: 0
  },
  saleTax: {
    type: Number,
    default: 0
  }
})

const shippingSchema = new Schema({
  info: {
    type: infoSchema,
    required: true
  },
  items: {
    type: [itemSchema]
  },
  cost: {
    type: costSchema
  },
  status: {
    type: String,
    required: true,
    enum: ['created', 'picked-up', 'shipped', 'delivered'],
    default: 'created'
  },
  note: {
    type: String
  },
  attachments: {
    type: Array
  },
  createdBy: {
    type: Object
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  rev: {
    type: Object
  }
});

shippingSchema.plugin(autoIncrement.plugin, {
  model: 'Shipping',
  field: 'shptNumber',
  startAt: 1,
  incrementBy: 1
});

const Shipping = mongoose.model('Shipping', shippingSchema);

module.exports = Shipping;