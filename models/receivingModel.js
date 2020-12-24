const mongoose = require('mongoose'),
  Schema = mongoose.Schema;

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
  procDate: {
    type: Date
  },
  status: {
    type: String,
    enum: ['received', 'processed'],
    default: 'received'
  },
  orderRef: {
    type: Array
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Receiving = mongoose.model('Receiving', receivingSchema);

module.exports = Receiving;