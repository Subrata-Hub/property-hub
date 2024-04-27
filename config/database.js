import mongoose from "mongoose";

let connected = false;

const connectDB = async () => {
  mongoose.set("strictQuery", true);

  // if the database already connected, don't connect again

  if (connected) {
    console.log("MongoDB is already connected...");
    return;
  }

  // Connected to DB
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    connected = true;
    console.log("MongoDB Connected.....");
  } catch (error) {
    console.log(error);
  }
};

export default connectDB;
