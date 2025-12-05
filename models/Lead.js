import mongoose from "mongoose";

const leadSchema = new mongoose.Schema(
  {
    companyId: { type: mongoose.Schema.Types.ObjectId, ref: "Company", required: true },
    name: { type: String, required: true },
    phone1: { type: String, required: true },
    phone2: { type: String },
    email: { type: String },
    message: { type: String },
    source: { type: String },
    status: { type: String, enum: ["new", "contacted", "converted", "lost"], default: "new" }
  },
  { timestamps: true }
);

export default mongoose.model("Lead", leadSchema);
