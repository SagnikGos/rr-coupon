import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import Coupon from "./models/coupon.js";
import Claim from "./models/claim.js";
import Admin from "./models/admin.js";
import Config from "./models/coupon.js"; // Import the Config model
import path from "path";


dotenv.config();
const app = express();




// Connect to MongoDB


mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

  


  
  

const __dirname = path.resolve();
app.use(express.static(path.join(__dirname, "../frontend/dist")));
  
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "frontend", "dist", "index.html"));
});
app.use(express.json());
app.use(cookieParser());
app.use(helmet());


// Rate limit to prevent abuse
const limiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 5, // 5 claims per 5 minutes
  message: "Too many requests, try again later.",
});
app.use("/claim-coupon", limiter);

// Middleware to verify JWT for admin
const verifyAdmin = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Unauthorized" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.adminId = decoded.id;
    next();
  } catch {
    res.status(401).json({ error: "Invalid token" });
  }
};
app.get("/", (req, res) => {
  res.send("Server is running!");
});


app.post("/claim-coupon", async (req, res) => {
  const ip = req.ip;
  const session = req.cookies.session || Math.random().toString(36).substring(2);
  res.cookie("session", session, { httpOnly: true });

  // Check if user has claimed recently
  const existingClaim = await Claim.findOne({ $or: [{ ip }, { session }] }).sort({ claimedAt: -1 });
  if (existingClaim && new Date() - new Date(existingClaim.claimedAt) < 5 * 60 * 1000) {
    return res.status(429).json({ message: "You must wait before claiming again." });
  }

  // Get or initialize last assigned index
  let config = await Config.findOne({ key: "lastAssignedIndex" });
  if (!config) {
    config = await Config.create({ key: "lastAssignedIndex", value: 0 });
  }

  // Get all available coupons sorted by creation date
  const coupons = await Coupon.find({ status: "pending" }).sort({ createdAt: 1 });
  if (!coupons.length) return res.status(404).json({ message: "No coupons available." });

  // Round-robin: Pick the next coupon
  const index = config.value % coupons.length;
  const coupon = coupons[index];

  // Mark coupon as claimed
  await Coupon.updateOne({ _id: coupon._id }, { status: "claimed", assignedTo: ip });

  // Store claim record
  await Claim.create({ couponId: coupon._id, ip, session });

  // Update round-robin index
  config.value = (config.value + 1) % coupons.length;
  await config.save();

  res.json({ message: "Coupon claimed!", coupon: coupon.code });
});

// **2. Admin Login**
app.post("/admin/login", async (req, res) => {
  const { username, password } = req.body;
  const admin = await Admin.findOne({ username });

  if (!admin || !bcrypt.compareSync(password, admin.password)) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
  res.json({ token });
});

// **3. Admin - View All Coupons**
app.get("/admin/coupons", verifyAdmin, async (req, res) => {
  const coupons = await Coupon.find();
  res.json(coupons);
});

// **4. Admin - Add Coupon**
app.post("/admin/coupons", verifyAdmin, async (req, res) => {
  try {
    const { code } = req.body;
    if (!code) {
      return res.status(400).json({ message: "Coupon code is required." });
    }

    // Check if the coupon already exists
    const existingCoupon = await Coupon.findOne({ code });

    if (existingCoupon) {
      // If coupon exists and is claimed, mark it as pending
      if (existingCoupon.status === "claimed") {
        existingCoupon.status = "pending";
        existingCoupon.assignedTo = null; // Remove assigned user
        await existingCoupon.save();
        return res.json({ message: "Coupon status reset to pending.", coupon: existingCoupon });
      }

      return res.status(400).json({ message: "Coupon already exists and is available." });
    }

    // Create a new coupon if it doesn't exist
    const newCoupon = await Coupon.create({ code, status: "pending" });
    res.json({ message: "New coupon added successfully.", coupon: newCoupon });
  } catch (error) {
    res.status(500).json({ message: "Error adding coupon", error });
  }
});

// **5. Admin - View Claims**
app.get("/admin/claims", verifyAdmin, async (req, res) => {
  const claims = await Claim.find().populate("couponId");
  res.json(claims);
});

// **6. Admin - Delete Coupon**
app.delete("/admin/coupons/:id", verifyAdmin, async (req, res) => {
  try {
    const deletedCoupon = await Coupon.findByIdAndDelete(req.params.id);
    if (!deletedCoupon) {
      return res.status(404).json({ message: "Coupon not found." });
    }
    res.json({ message: "Coupon deleted successfully." });
  } catch (error) {
    res.status(500).json({ message: "Error deleting coupon", error });
  }
});

app.post("/admin/register", async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ message: "Username and password required" });

    const existingAdmin = await Admin.findOne({ username });
    if (existingAdmin) return res.status(400).json({ message: "Admin already exists" });

    const admin = new Admin({ username, password });
    await admin.save();

    res.status(201).json({ message: "Admin registered successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error registering admin", error });
  } 
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
