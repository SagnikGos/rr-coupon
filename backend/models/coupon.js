import mongoose from "mongoose";

const CouponSchema = new mongoose.Schema({
  code: { type: String, unique: true, required: true },
  status: { type: String, enum: ["pending", "claimed"], default: "pending" },
  assignedTo: { type: String, default: null }, // IP or session ID
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Coupon", CouponSchema);
