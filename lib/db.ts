import mongoose from "mongoose";

export async function connectDB() {
  const DB_URI = process.env.DB_URI;

  if (!DB_URI) {
    console.error("DB URI not found");
    throw new Error("DB URI not found");
  }
  
  try {
    await mongoose.connect(DB_URI);
    console.log("Connection to DB successfull");
  } catch (error) {
    console.error("Error while connecting to DB: ", error);
    throw error;
  }
}
