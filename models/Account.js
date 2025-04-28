import mongoose from "mongoose";

const accountSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: { type: String },
    provider: { type: String, required: true },
    providerAccountId: { type: String, required: true },
    access_token: { type: String },
    refresh_token: { type: String },
    expires_at: { type: Number },
    token_type: { type: String },
    scope: { type: String },
    id_token: { type: String },
    session_state: { type: String },
  },
  { unique: [{ provider: 1, providerAccountId: 1 }] }
);

const Account =
  mongoose.models.Account || mongoose.model("Account", accountSchema);

export default Account;
