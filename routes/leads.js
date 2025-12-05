import express from "express";
import auth from "../middleware/auth.js";
import Lead from "../models/Lead.js";

const router = express.Router();


router.use(auth);


router.post("/", async (req, res) => {
  try {
    if (!req.user.companyId) return res.status(400).json({ message: "No company context" });
    const lead = new Lead({ ...req.body, companyId: req.user.companyId });
    await lead.save();
    res.json(lead);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


router.get("/", async (req, res) => {
  try {
    if (!req.user.companyId) return res.status(400).json({ message: "No company context" });
    const leads = await Lead.find({ companyId: req.user.companyId }).sort({ createdAt: -1 });
    res.json(leads);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


router.put("/:id", async (req, res) => {
  try {
    const lead = await Lead.findOneAndUpdate(
      { _id: req.params.id, companyId: req.user.companyId },
      req.body,
      { new: true }
    );
    if (!lead) return res.status(404).json({ message: "Lead not found" });
    res.json(lead);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


router.delete("/:id", async (req, res) => {
  try {
    const lead = await Lead.findOneAndDelete({ _id: req.params.id, companyId: req.user.companyId });
    if (!lead) return res.status(404).json({ message: "Lead not found" });
    res.json({ message: "Lead deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
