const mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  autoIncrement = require('mongoose-auto-increment')

autoIncrement.initialize(mongoose)

const warehouseSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  type: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
})

warehouseSchema.plugin(autoIncrement.plugin, {
  model: 'Warehouse',
  field: 'warehouseNumber',
  startAt: 1,
  incrementBy: 1
})

const Warehouse = mongoose.model('Warehouse', warehouseSchema);

module.exports = Warehouse;