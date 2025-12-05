import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    companyId: { type: mongoose.Schema.Types.ObjectId, ref: "Company", required: true },
    email: { type: String, required: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ["user", "admin"], default: "user" }
  },
  { timestamps: true }
);

// helper to set password
userSchema.methods.setPassword = async function (plain) {
  const salt = await bcrypt.genSalt(10);
  this.passwordHash = await bcrypt.hash(plain, salt);
};

// compare password
userSchema.methods.comparePassword = async function (plain) {
  return await bcrypt.compare(plain, this.passwordHash);
};

userSchema.index({ companyId: 1, email: 1 }, { unique: true });

export default mongoose.model("User", userSchema);
