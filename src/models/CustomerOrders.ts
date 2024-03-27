import { ObjectId } from "mongodb";
import mongoose from "mongoose";


const customerOrdersSchema = new mongoose.Schema({
  totalAmount: { type: Number, required: true },
  paymentIntentId: { type: String, required: true },
  items: [{
    productId: { type: ObjectId, ref: 'Beats', required: true },
    sellerId: { type: ObjectId, ref: 'Users', required: true },
    price: { type: Number, required: true },
    contract: { type: String, required: true },
    licenseType: { type: String, required: true },
    licenseTerms: { type: Object, required: true },
  }],
  status: { type: String, enum: ['pending', 'completed', 'failed'], default: "pending", },
  transferGroup: { type: String, required: true, unique: true },
  customerDetails: {
    customerId: { type: ObjectId, ref: 'Users', required: true },
    billingAddress: { type: Object, },
    email: { type: String },
  },
  createdAt: { type: Date, default: Date.now, },
});

const Customer_Orders = mongoose.models.Customer_Orders || mongoose.model('Customer_Orders', customerOrdersSchema);


export default Customer_Orders;