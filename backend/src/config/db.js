const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
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
