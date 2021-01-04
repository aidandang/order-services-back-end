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
  itemNumber: {
    type: Number
  },
  orderNumber: {
    type: Number
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
  warehouse: {
    type: String,
    required: true,
    default: "5f9afc8fac9c490cd193b3ee"
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

const Receiving = mongoose.model('Receiving', receivingSchema);

module.exports = Receiving;