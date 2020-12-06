const mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  autoIncrement = require('mongoose-auto-increment');

autoIncrement.initialize(mongoose);

const shippingSchema = new Schema({
  waybill: {
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
  status: {
    type: String,
    enum: ['created', 'picked-up', 'shipped', 'delivered'],
    default: 'created'
  },
  items: {
    type: Array,
    default: []
  },
  weight: {
    type: Number,
    default: 0
  },
  shptCost: {
    type: Number,
    default: 0
  },
  courier: {
    type: Object
  },
  consignee: {
    type: Object
  },
  note: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
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