const mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  autoIncrement = require('mongoose-auto-increment')

autoIncrement.initialize(mongoose)

const shippingInfoSchema = new Schema({
  fullname: {
    type: String,
    required: true
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
  },
  note: {
    type: String
  }
})

const customerSchema = new Schema({
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
  email: {
    type: String
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
    type: String
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
  note: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
})

customerSchema.plugin(autoIncrement.plugin, {
  model: 'Customer',
  field: 'customerNumber',
  startAt: 110000,
  incrementBy: 1
})

const Customer = mongoose.model('Customer', customerSchema)

module.exports = Customer