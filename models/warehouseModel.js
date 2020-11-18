const mongoose = require('mongoose'),
  Schema = mongoose.Schema;

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
});

const Warehouse = mongoose.model('Warehouse', warehouseSchema);

module.exports = Warehouse;