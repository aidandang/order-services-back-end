const mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  autoIncrement = require('mongoose-auto-increment');

autoIncrement.initialize(mongoose);

const addressSchema = new Schema({
  fullname: {
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
})

const courierSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  address: {
    type: [addressSchema]
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

courierSchema.plugin(autoIncrement.plugin, {
  model: 'Courier',
  field: 'courNumber',
  startAt: 1,
  incrementBy: 1
});

const Courier = mongoose.model('Courier', courierSchema);

module.exports = Courier;