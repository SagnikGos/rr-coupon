import mongoose from "mongoose";

const ClaimSchema = new mongoose.Schema({
  couponId: { type: mongoose.Schema.Types.ObjectId, ref: "Coupon", required: true },
  ip: { type: String, required: true },
  session: { type: String, required: true },
  claimedAt: { type: Date, default: Date.now }
});

export default mongoose.model("Claim", ClaimSchema);
