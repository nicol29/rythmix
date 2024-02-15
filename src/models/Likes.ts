import { ObjectId } from "mongodb";
import mongoose from "mongoose";


const likesSchema = new mongoose.Schema({
  producer: { type: ObjectId, ref: 'Users' },
  beat: { type: ObjectId, ref: 'Beats' },
  time: { type: Date, default: Date.now },
});


const Likes = mongoose.models.Likes || mongoose.model('Likes', likesSchema);

export default Likes;