import mongoose from "mongoose";
  

const userSchema = new mongoose.Schema({
  userName: { type: String, },
  userType: { type: String, },
  email: { type: String, required: true, unique: true, },
  password: { type: String, },
  profilePicture: { type: String, default: null, },
  profileUrl: { type: String, required: true, unique: true, },
  createdAt: { type: Date, required: true, default: Date.now,  },
  walletAddress: { type: String, },
  isProfileCompleted: { type: Boolean, default: false, },
  biography: { type: String, },
  country: { type: String, },
  licenseTerms: {
    basic: {
      distributionCopies: { type: String, default: "2000", },
      audioStreams: { type: String, default: "500000", },
      musicVideos: { type: String, default: "1", },
      radioStations: { type: String, default: "1", },
      allowProfitPerformances: { type: Boolean, default: true, },
      country: { type: String },
    },
    premium: {
      distributionCopies: { type: String, default: "2000", },
      audioStreams: { type: String, default: "1000000", },
      musicVideos: { type: String, default: "1", },
      radioStations: { type: String, default: "2", },
      allowProfitPerformances: { type: Boolean, default: true, },
      country: { type: String },
    }, 
    exclusive: {
      distributionCopies: { type: String, default: "Unlimited", },
      audioStreams: { type: String, default: "1000000", },
      musicVideos: { type: String, default: "3", },
      radioStations: { type: String, default: "Unlimited", },
      allowProfitPerformances: { type: Boolean, default: true, },
      country: { type: String },
    }
  },
  stripeDetails: {
    accountId: { type: String, },
    onBoardStatus: { 
      type: String, enum: ["unstarted", "incomplete", "complete"], 
      default: "unstarted",
    },
    
  }
});

const Users = mongoose.models.Users || mongoose.model('Users', userSchema);

export default Users;
