import { ObjectId } from "mongodb";
import mongoose from "mongoose";
import dayjs from 'dayjs';


const beatsSchema = new mongoose.Schema({
  title: { type: String },
  bpm: { type: String },
  key: { type: String },
  genre: { type: String },
  mood: { type: String },
  tags: [{ type: String }],
  producer: { 
    _id: { type: ObjectId, required: true, ref: "Users" },
    userName: { type: String, required: true },
    profileUrl: { type: String, required: true },
  },
  urlIdentifier: { type: Number, required: true, unique: true },
  status: { type: String, default: "draft" },
  assets: { 
    artwork: { url: { type: String }, publicId: { type: String }, fileName: { type: String } },
    mp3: { url: { type: String }, publicId: { type: String }, fileName: { type: String }  },
    wav: { url: { type: String }, publicId: { type: String }, fileName: { type: String }  },
  },
  licenses: {
    basic: { price: { type: Number }, selected: { type: Boolean } },
    premium: { price: { type: Number }, selected: { type: Boolean } },
    exclusive: { price: { type: Number }, selected: { type: Boolean } },
  },
  createdAt: { type: Date, default: Date.now, },
  comments: [{
    author: { type: ObjectId, ref: 'Users', required: true },
    text: { type: String, required: true },
    date: { type: Date, default: Date.now, },
  }],
  plays: { type: Number, default: 0 }
})

beatsSchema.virtual('formattedDate').get(function() {
  const date: Date | undefined = new Date(this.createdAt);
  const formattedDate = dayjs(date).format('DD MMM YYYY');

  return `${formattedDate}`;
});

beatsSchema.set('toJSON', { virtuals: true });
beatsSchema.set('toObject', { virtuals: true });

const Beats = mongoose.models.Beats || mongoose.model('Beats', beatsSchema);


export default Beats;

