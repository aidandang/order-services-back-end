const mongoose = require('mongoose'), Schema = mongoose.Schema

const revisionSchema = new Schema({
  collectionName: {
    type: String,
    required: true,
    enum: ['orders', 'receivings', 'items'],
    index: true
  },
  documentId: {
    type: String,
    required: true,
    index: true
  },
  revision: {
    type: Object,
    required:true
  },
  createdAt: {
    type: Date,
    default: Date.now,
    index: true
  }
})

const Revision = mongoose.model('Revision', revisionSchema)
module.exports = Revision