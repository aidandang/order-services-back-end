const mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  autoIncrement = require('mongoose-auto-increment')

autoIncrement.initialize(mongoose)

const colorSchema = new Schema({
  color: {
    type: String,
    required: true
  },
  url: {
    type: String,
    trim: true,
    default: ''
  },
  image: {
    type: String,
    trim: true,
    default: ''
  } 
})

const productSchema = new Schema({
  name: {
    type: String,
    unique: true,
    required: true
  },
  brand: {
    type: Object,
    required: true
  },
  styleCode: {
    type: String,
    required: true
  },
  sku: {
    type: String,
    default: ''
  },
  styleImage: {
    type: String,
    required: true
  },
  desc: {
    type: String,
    required: true
  },
  url: {
    type: String,
    trim: true,
    default: ''
  },
  colors: {
    type: [colorSchema]
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
})

productSchema.plugin(autoIncrement.plugin, {
  model: 'Product',
  field: 'productNumber',
  startAt: 7,
  incrementBy: 1
})

const Product = mongoose.model('Product', productSchema)

module.exports = Product