const mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  autoIncrement = require('mongoose-auto-increment')

autoIncrement.initialize(mongoose)

const receivingSchema = new Schema({
  tracking: {
    type: String,
    required: true,
    unique: true
  },
  receivedDate: {
    type: Date,
    required: true
  },
  warehouseNumber: {
    type: Number,
    required: true
  },
  processedDate: {
    type: Date
  },
  returnedDate: {
    type: Date
  },
  status: {
    type: String,
    enum: ['received', 'processed', 'returned'],
    default: 'received',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
})

receivingSchema.plugin(autoIncrement.plugin, {
  model: 'Receiving',
  field: 'receivingNumber',
  startAt: 1,
  incrementBy: 1
})

const Receiving = mongoose.model('Receiving', receivingSchema)

module.exports = Receiving