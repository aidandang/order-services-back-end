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
  orderRef: {
    type: String,
    default: ''
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Receiving = mongoose.model('Receiving', receivingSchema);

module.exports = Receiving;