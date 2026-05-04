import mongoose, { Schema, Document } from 'mongoose';

export interface IOrder extends Document {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId | null;
  customer: {
    name: string;
    phone: string;
    address: string;
    city: string;
  };
  items: Array<{
    productId: mongoose.Types.ObjectId;
    title: string;
    price: number;
    image: string;
    quantity: number;
  }>;
  total: number;
  status: 'pending' | 'shipped' | 'delivered';
  paymentMethod: 'COD';
  createdAt: Date;
  updatedAt: Date;
}

const orderSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', default: null },
    customer: {
      name: { type: String, required: true },
      phone: { type: String, required: true },
      address: { type: String, required: true },
      city: { type: String, required: true },
    },
    items: [
      {
        productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
        title: { type: String, required: true },
        price: { type: Number, required: true },
        image: { type: String, required: true },
        quantity: { type: Number, required: true, min: 1 },
      },
    ],
    total: { type: Number, required: true, min: 0 },
    status: {
      type: String,
      enum: ['pending', 'shipped', 'delivered'],
      default: 'pending',
    },
    paymentMethod: { type: String, enum: ['COD'], default: 'COD' },
  },
  { timestamps: true }
);

export default mongoose.model<IOrder>('Order', orderSchema);
