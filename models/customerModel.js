const mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  autoIncrement = require('mongoose-auto-increment');

autoIncrement.initialize(mongoose);

const shippingInfoSchema = new Schema({
  fullname: {
    type: String,
    required: true
  },
  othername: {
    type: String,
    required: false
  },
  country: {
    type: String,
    required: true
  },
  streetAddress1: {
    type: String,
    required: true
  },
  streetAddress2: {
    type: String,
    required: false
  },
  city: {
    type: String,
    required: true
  },
  state: {
    type: String,
    required: true
  },
  zipcode: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  }
});

const revSchema = new Schema({
  modifiedAt: {
    type: Date,
    require: true,
    default: Date.now
  }
});

const customerSchema = new Schema({
  email: {
    type: String,
    required: false,
    unique: false
  },
  nickname: {
    type: String,
    required: true,
    index: true
  },
  fullname: {
    type: String,
    required: true,
    index: true
  },
  othername: {
    type: String,
    required: false
  },
  country: {
    type: String,
    required: true
  },
  streetAddress1: {
    type: String,
    required: true,
    index: true
  },
  streetAddress2: {
    type: String,
    required: false
  },
  city: {
    type: String,
    required: true
  },
  state: {
    type: String,
    required: true,
    index: true
  },
  zipcode: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true,
    unique: true
  },
  shippingInfo: {
    type: [shippingInfoSchema]
  },
  shippingAddress: {
    type: String,
    default: ''
  },
  active: {
    type: Boolean,
    default: false
  },
  rev: {
    type: [revSchema]
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

customerSchema.plugin(autoIncrement.plugin, {
  model: 'Customer',
  field: 'account',
  startAt: 110001,
  incrementBy: 1
});

const Customer = mongoose.model('Customer', customerSchema);

module.exports = Customer;