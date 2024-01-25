import { ObjectId } from "mongodb";
import mongoose from "mongoose";
  
const beatsSchema = new mongoose.Schema({
  title: { type: String },
  bpm: { type: Number },
  key: { type: String },
  genre: { type: String },
  mood: { type: String },
  producer: { 
    _id: { type: ObjectId, required: true },
    userName: { type: String, required: true },
    profileUrl: { type: String, required: true },
  },
  urlIdentifier: { type: Number, required: true, unique: true },
  status: { type: String, default: "draft" },
  assets: { 
    preview: { type: String },
    coverArt: { type: String },
  },
  licenses: {  },
  createdAt: { type: Date, default: Date.now, },
})

beatsSchema.virtual('fullUrl').get(function() {
  const lowerCaseTitle: string | undefined = this.title?.toLocaleLowerCase();
  const removeSpaceTitle: string | undefined = lowerCaseTitle?.replace(/\s+/g, '-');

  return `/${removeSpaceTitle}-${this.urlIdentifier}`;
});

const Beats = mongoose.models.Beats || mongoose.model('Beats', beatsSchema);

export default Beats;

