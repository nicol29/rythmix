import { ObjectId } from "mongodb";
import mongoose from "mongoose";


const notificationsSchema = new mongoose.Schema({
  userId: { type: ObjectId, ref: 'Users', required: true },
  type: { type: String, enum: ['comment', 'like', 'purchase', 'system'], required: true },
  message: { type: String },
  from: { type: ObjectId, ref: 'Users' },
  read: { type: Boolean, default: false },
  resourceId: { type: String },
});


const Notifications = mongoose.models.Notifications || mongoose.model('Notifications', notificationsSchema);


export default Notifications;