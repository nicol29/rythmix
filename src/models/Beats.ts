import { ObjectId } from "mongodb";
import mongoose from "mongoose";
  
const beatsSchema = new mongoose.Schema({
  title: { type: String, required: true },
  bpm: { type: Number, required: true },
  key: { type: String },
  genre: { type: String, required: true },
  moods: { type: Array },
  producer: { 
    _id: { type: ObjectId, required: true },
    name: { type: String, required: true },
    profileUrl: { type: String, required: true },
  },
  assets: { 
    preview: { type: String, required: true },
    coverArt: { type: String, required: true },
  },
  licenses: {  },
  createdAt: { type: Date, required: true, default: Date.now, },
})

const Beats = mongoose.models.Beats || mongoose.model('Beats', beatsSchema);

export default Beats;

