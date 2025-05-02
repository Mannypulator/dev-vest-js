import mongoose from "mongoose";

const verificationSchema = new mongoose.Schema({
  token: { type: String },
  identified: { type: String },
  expires: { type: Date, required: true },
});

const VerificationToken =
  mongoose.models.VerificationToken ||
  mongoose.model("VerificationToken", verificationSchema);

export default VerificationToken;
