import mongoose from "mongoose";

export const connectDB = async () => {
  if (!process.env.MONGO_URI) {
    console.warn("MongoDB URI not configured, using local file persistence only");
    return false;
  }

  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB Connected");
    return true;
  } catch (error) {
    console.warn("MongoDB unavailable, continuing with local file persistence");
    console.warn(error.message);
    return false;
  }
};

export default connectDB;
