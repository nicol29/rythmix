import mongoose from "mongoose";
  

const userSchema = new mongoose.Schema({
  userName: { type: String, },
  userType: { type: String, },
  email: { type: String, required: true, unique: true, },
  password: { type: String, },
  profilePicture: { type: String, default: null, },
  profileUrl: { type: String, required: true, unique: true, },
  createdAt: { type: Date, required: true, default: Date.now, },
  walletAddress: { type: String, },
  isProfileCompleted: { type: Boolean, default: false, },
});


// const Users = mongoose.model('Users', userSchema);

const Users = mongoose.models.Users || mongoose.model('Users', userSchema);


export default Users;
