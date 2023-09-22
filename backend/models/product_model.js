const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  category:{
    type: String,
    required: true
  },
  description:{
    type : String,
    required : true
  },
  images: [
    {
      data: Buffer,
      contentType: String,
    }
  ],
  price: {
    type: Number,
    required: true,
  },
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Seller', 
    required: true,
  },
  rating : String,
  review : String,
  delivery: String,
  totalQuantity: Number,
  approvalStatus: {
    type: String,
    enum: ['Pending', 'Approved', 'Rejected'],
    default: 'Pending',
  },
});

const Product = mongoose.model('product_uploaded', productSchema);
module.exports = Product;
