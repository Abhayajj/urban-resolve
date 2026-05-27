const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const rawUri = process.env.MONGO_URI || '';
    const trimmedUri = rawUri.trim();
    if (rawUri !== trimmedUri) {
      console.warn("⚠️ WARNING: MONGO_URI has leading/trailing whitespaces! Length:", rawUri.length, "vs trimmed:", trimmedUri.length);
    }
    
    // Mask password in logs
    let maskedUri = rawUri;
    try {
      const match = rawUri.match(/:([^:]+)@/);
      if (match) {
        maskedUri = rawUri.replace(match[1], "***");
      }
    } catch (e) {}
    console.log(`Connecting to MongoDB Atlas... URI (masked): ${maskedUri}`);

    const conn = await mongoose.connect(trimmedUri, {
      serverSelectionTimeoutMS: 10000,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    console.error(`⚠️  Make sure your IP is whitelisted on MongoDB Atlas!`);
    // Don't crash the server — retry after 5s
    console.log(`Retrying in 5 seconds...`);
    setTimeout(connectDB, 5000);
  }
};

module.exports = connectDB;
