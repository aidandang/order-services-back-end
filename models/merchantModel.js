const mongoose = require('mongoose'),
  Schema = mongoose.Schema;

const merchantSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  url: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Merchant = mongoose.model('Merchant', merchantSchema);

module.exports = Merchant;