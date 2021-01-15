const mongoose = require('mongoose'),
  Schema = mongoose.Schema;

const recvItemSchema = new Schema({
  qty: {
    type: Number,
    required: true
  },
  desc: {
    type: String,
    required: true
  },
  itemRef: {
    type: String
  }
})

const receivingSchema = new Schema({
  tracking: {
    type: String,
    required: true,
    unique: true
  },
  recvDate: {
    type: Date,
    required: true
  },
  warehouseNumber: {
    type: Number,
    required: true
  },
  chkdDate: {
    type: Date
  },
  recvItems: [recvItemSchema],
  procDate: {
    type: Date
  },
  status: {
    type: String,
    enum: ['received', 'checked', 'processed'],
    default: 'received'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Receiving = mongoose.model('Receiving', receivingSchema)

module.exports = Receiving