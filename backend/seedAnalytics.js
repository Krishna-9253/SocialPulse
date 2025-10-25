import mongoose from "mongoose";
import dotenv from "dotenv";
import Analytics from "./models/Analytics.js";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI;

const analyticsData = [
  { date: "2025-10-01", likes: 150, comments: 40, shares: 10 },
  { date: "2025-10-05", likes: 220, comments: 65, shares: 22 },
  { date: "2025-10-10", likes: 280, comments: 70, shares: 30 },
  { date: "2025-10-15", likes: 200, comments: 55, shares: 25 },
  { date: "2025-10-20", likes: 320, comments: 90, shares: 40 },
];

const seedAnalytics = async () => {
  try {
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("MongoDB connected for seeding...");

    // Clear existing data
    await Analytics.deleteMany();
    console.log("Existing analytics data cleared.");

    // Insert new data
    await Analytics.insertMany(analyticsData);
    console.log("Analytics data seeded successfully.");

    mongoose.disconnect();
    console.log("MongoDB disconnected.");
  } catch (err) {
    console.error("Error seeding analytics:", err);
  }
};

seedAnalytics();
