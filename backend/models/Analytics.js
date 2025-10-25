import mongoose from "mongoose";

const analyticsSchema = new mongoose.Schema({
  date: { type: String, required: true },
  likes: { type: Number, default: 0 },
  comments: { type: Number, default: 0 },
  shares: { type: Number, default: 0 },
});

const Analytics = mongoose.model("Analytics", analyticsSchema);
export default Analytics;
