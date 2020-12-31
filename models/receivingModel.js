const mongoose = require('mongoose'),
  Schema = mongoose.Schema;

const itemSchema = new Schema({
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
  },
  orderRef: {
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
  warehouse: {
    type: String,
    required: true,
    default: "5f9afc8fac9c490cd193b3ee"
  },
  chkdDate: {
    type: Date
  },
  items: [itemSchema],
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