const mongoose = require('mongoose'),
  Schema = mongoose.Schema

  const itemSchema = new Schema({
    warehouse: {
      type: Number,
      required: true,
      index: true
    },
    receivingNumber: {
      type: Number,
      required: true,
      index: true
    },
    orderNumber: {
      type: Number,
      required: true,
      index: true
    },
    orderItem: {
      type: Object,
      required: true
    },
    shippingNumber: {
      type: Number
    },
    packedDate: {
      type: Date
    },
    waybillNumber: {
      type: String
    },
    status: {
      type: String,
      enum: ['received', 'packed', 'shipped', 'delivered'],
      required: true
    },
    deliveredInfo: {
      type: Object
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  })

const Item = mongoose.model('Item', itemSchema)

module.exports = Item