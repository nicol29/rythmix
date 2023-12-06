import mongoose from "mongoose";
  

const userSchema = new mongoose.Schema({
  userName: { type: String, required: true, },
  userType: { type: String, required: true },
  email: { type: String, required: true, unique: true, },
  password: { type: String, required: true, },
  profilePicture: { type: String, required: false, },
  profileUrl: { type: String, required: true, unique: true },
  createdAt: { type: Date, required: true, default: Date.now, },
  walletAddress: { type: String },
});


// const Users = mongoose.model('Users', userSchema);

const Users = mongoose.models.Users || mongoose.model('Users', userSchema);


export default Users;
