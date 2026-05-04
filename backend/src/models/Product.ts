import mongoose, { Schema, Document } from 'mongoose';

export interface IProduct extends Document {
  _id: mongoose.Types.ObjectId;
  title: string;
  description: string;
  price: number;
  category: 'Audio' | 'Wearables' | 'Charge' | 'Accessoires' | 'Gaming';
  brand: 'Atlas' | 'Sahara' | 'MedinaTech' | 'Argan' | 'Casablanca';
  stock: number;
  image: string;
  rating: number;
  reviewsCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const productSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    category: {
      type: String,
      enum: ['Audio', 'Wearables', 'Charge', 'Accessoires', 'Gaming'],
      required: true,
    },
    brand: {
      type: String,
      enum: ['Atlas', 'Sahara', 'MedinaTech', 'Argan', 'Casablanca'],
      required: true,
    },
    stock: { type: Number, required: true, min: 0 },
    image: { type: String, required: true },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    reviewsCount: { type: Number, default: 0, min: 0 },
  },
  { timestamps: true }
);

export default mongoose.model<IProduct>('Product', productSchema);
