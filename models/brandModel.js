const mongoose = require('mongoose'),
  Schema = mongoose.Schema;

const brandSchema = new Schema({
  name: {
    type: String,
    unique: true,
    lowercase: true,
    required: true
  },
  preferredName: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Brand = mongoose.model('Brand', brandSchema);

module.exports = Brand;