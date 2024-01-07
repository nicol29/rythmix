import mongoose from 'mongoose';

// if (process.env.MONGODB_URI) {
//   mongoURI = process.env.MONGODB_URI;
// } else {
//   console.log("MongoDB URI is missing/invalid:" + process.env.MONGODB_URI);
// };

// const connectMongoDB = async () => {
//   try {
//     const options: any = {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//     };

//     await mongoose.connect(mongoURI, options);
//     console.log("Connection successful");
//   } catch (error) {
//     console.error("Connection error:", error);
//   }
// }
// global.mongoose = {
//   conn: null,
//   promise: null
// }

declare module global {
  var mongoose: {
    conn: any
    promise: any
  }
}

const connectMongoDB = async () => {
  try {
    if (global.mongoose && global.mongoose.conn) {
      console.log("Connected via previous connection");
      return global.mongoose.conn;
    } else {
      const mongoURIString = process.env.MONGODB_URI ?? "";

      const res = await mongoose.connect(mongoURIString, {
        autoIndex: true,
      });

      global.mongoose = {
        conn: res,
        promise: res,
      };

      console.log("Connected via new connection");
      return res;
    }
  } catch (error) {
    console.error("Error connecting to the database:", error);
    throw new Error("Database connection failed");
  }
}

export default connectMongoDB;
