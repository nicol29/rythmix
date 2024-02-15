import { ObjectId } from "mongodb";
import mongoose from "mongoose";


const playsSchema = new mongoose.Schema({
  beat: { type: ObjectId, ref: 'Beats' },
  time: { type: Date, default: Date.now },
});


const Plays = mongoose.models.Plays || mongoose.model('Plays', playsSchema);


export default Plays;