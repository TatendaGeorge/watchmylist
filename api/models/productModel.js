import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  url: { type: String, required: true, unique: true },
  currency: { type: String, required: true },
  image: { type: String, required: true },
  title: { type: String, required: true },
  currentPrice: { type: Number, required: true },
  originalPrice: { type: Number, required: true },
  priceHistory: [
    { 
      price: { type: Number, required: true },
      originalPrice: { type: Number, required: true},
      date: { type: Date, default: Date.now }
    },
  ],
  lowestPrice: { type: Number },
  highestPrice: { type: Number },
  averagePrice: { type: Number },
  discountRate: { type: Number },
  description: { type: String },
  category: { type: String },
  reviewsCount: { type: Number },
  reviews: [
    {review: { type: String, required: false}}
  ],
  isOutOfStock: { type: Boolean, default: false },
  users: [
    {
      email: { type: String, required: true},
      userId: { type: String, required: true },
      onSale: { type: Boolean, required: false },
      inStock: { type: Boolean, required: false },
      priceDrop: { type: Boolean, required: false },
      desiredPrice: { type: Boolean, required: false },
      desiredPriceValue: { type: Number, required: false },
    }
  ], default: [],
}, { timestamps: true });

const Product = mongoose.models.Product || mongoose.model('Product', productSchema);

export default Product;