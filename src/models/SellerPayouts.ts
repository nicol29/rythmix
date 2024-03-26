import { ObjectId } from "mongodb";
import mongoose from "mongoose";


const sellerPayoutsSchema = new mongoose.Schema({
  sellerId: { type: ObjectId, ref: 'Users', required: true },
  totalAmount: { type: Number, required: true },
  paymentIntentId: { type: String, required: true },
  transferId: { type: String, required: true },
  productId: { type: ObjectId, ref: 'Beats', required: true },
  contract: { type: String, required: true },
  licenseType: { type: String, required: true },
  licenseTerms: { type: Object, required: true },
  buyerId: { type: ObjectId, ref: 'Users', required: true },
  transferGroup: { type: String, required: true },
  buyerAddress: { type: Object, },
  createdAt: { type: Date, default: Date.now, },
});


const Seller_Payouts = mongoose.models.Seller_Payouts || mongoose.model('Seller_Payouts', sellerPayoutsSchema);


export default Seller_Payouts;