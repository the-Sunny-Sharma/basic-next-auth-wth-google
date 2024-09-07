import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import mongoose from "mongoose";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const connectToDatabase = async () => {
  try {
    if (mongoose.connection.readyState === 1) {
      console.log("Already connected to the database.");
      return;
    }
    const { connection } = await mongoose.connect(
      process.env.MONGO_URI as string,
      {
        dbName: "nextAuth",
      }
    );
    console.log(`Connected to database: ${connection.host}`);
  } catch (error) {
    console.error("Error connecting to database:", error);
    throw new Error("Error connecting to database");
  }
};
