
import express from "express";
import auth from "../middleware/auth.js";
import Lead from "../models/Lead.js";

const router = express.Router();
router.use(auth);

const adminOnly = (req, res, next) => {
  if (req.user?.role !== "admin") {
    return res.status(403).json({ message: "Admin access required" });
  }
  next();
};


router.get("/leads", adminOnly, async (req, res) => {
  try {
    const leads = await Lead.find({})
      .populate("companyId", "name") 
      .sort({ createdAt: -1 });
    res.json(leads);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


router.delete("/leads/:id", adminOnly, async (req, res) => {
  try {
    const lead = await Lead.findByIdAndDelete(req.params.id);
    if (!lead) return res.status(404).json({ message: "Not found" });
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
