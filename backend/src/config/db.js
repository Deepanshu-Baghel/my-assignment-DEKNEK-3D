const mongoose = require("mongoose");

const connectDB = async () => {
  const { MONGODB_URI } = process.env;

  if (!MONGODB_URI) {
    throw new Error("MONGODB_URI is missing in environment variables.");
  }

  if (MONGODB_URI.includes("<db_password>") || MONGODB_URI.includes("<password>")) {
    throw new Error(
      "MONGODB_URI still contains a placeholder password. Replace it with your real Atlas DB user password (URL-encode special characters)."
    );
  }

  await mongoose.connect(MONGODB_URI, {
    serverSelectionTimeoutMS: 5000,
  });
  console.log("MongoDB connected");
};

module.exports = connectDB;
