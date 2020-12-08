const mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  autoIncrement = require('mongoose-auto-increment');

autoIncrement.initialize(mongoose);

const consigneeSchema = new Schema({
  name: {
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
    type: String
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
  createdAt: {
    type: Date,
    default: Date.now
  }
});

consigneeSchema.plugin(autoIncrement.plugin, {
  model: 'Consignee',
  field: 'cneeNumber',
  startAt: 1,
  incrementBy: 1
});

const Consignee = mongoose.model('Consignee', consigneeSchema);

module.exports = Consignee;