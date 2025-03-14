import mongoose from "mongoose";

const ConfigSchema = new mongoose.Schema({
  key: { type: String, unique: true, required: true },
  value: { type: Number, default: 0 }, // Stores last assigned index
});

export default mongoose.model("Config", ConfigSchema);
