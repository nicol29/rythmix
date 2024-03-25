import { ObjectId } from "mongodb";
import mongoose from "mongoose";


const customerOrdersSchema = new mongoose.Schema({
  totalAmount: { type: Number, required: true },
  paymentIntentId: { type: String, required: true },
  items: [{
    productId: { type: ObjectId, ref: 'Beats', required: true },
    sellerId: { type: ObjectId, ref: 'Users', required: true },
    price: { type: Number, required: true },
  }],
  buyerId: { type: ObjectId, ref: 'Users', required: true },
  status: { type: String, enum: ['pending', 'complete'], default: "pending", },
  transferGroup: { type: String, required: true, unique: true },
  createdAt: { type: Date, default: Date.now, },
});


const Customer_Orders = mongoose.models.Customer_Orders || mongoose.model('Customer_Orders', customerOrdersSchema);


export default Customer_Orders;