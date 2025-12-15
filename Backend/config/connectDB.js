const mongoose = require("mongoose");

const connectWithDB = async () => {
  const DATABASE_URL = process.env.DATABASE_URL;
  if (!DATABASE_URL) {
    throw new Error("FATAL: DATABASE_URL environment variable is not set.");
  }

  try {
    const connection = await mongoose.connect(DATABASE_URL);

    console.log(`MongoDB Connected: ${connection.connection.host}`);

    mongoose.connection.on("disconnected", () => {
      console.warn("MongoDB Disconnected! Attempting to reconnect...");
    });
  } catch (err) {
    console.error("Database connection failed. Exiting process.");
    console.error("Error details:", err.message);

    process.exit(1);
  }
};

module.exports = connectWithDB;
