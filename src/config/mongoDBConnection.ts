import mongoose from 'mongoose';

let mongoURI : string; 

if (process.env.MONGODB_URI) {
  mongoURI = process.env.MONGODB_URI;
} else {
  console.log("MongoDB URI is missing/invalid:" + process.env.MONGODB_URI);
};

const connectMongoDB = async () => {
  try {
    const options: any = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    };

    await mongoose.connect(mongoURI, options);
    console.log("Connection successful");
  } catch (error) {
    console.error("Connection error:", error);
  }
}

export default connectMongoDB;

