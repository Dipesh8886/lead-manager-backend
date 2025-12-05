import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Company from "../models/Company.js";
import User from "../models/User.js";

const router = express.Router();

function signToken(payload) {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "12h" });
}


router.post("/register-company", async (req, res) => {
  try {
    const { companyName, adminEmail, adminPassword } = req.body || {};
    if (!companyName || !adminEmail || !adminPassword) {
      return res.status(400).json({ message: "Missing fields" });
    }


    const company = await Company.create({ name: companyName.trim() });

    const passwordHash = await bcrypt.hash(adminPassword, 10);
    const user = await User.create({
      companyId: company._id,
      email: adminEmail.toLowerCase(),
      passwordHash,
      role: "user"
    });

    const token = signToken({
      userId: user._id.toString(),
      companyId: company._id.toString(),
      role: "user"
    });

    return res.status(201).json({ token, companyId: company._id.toString() });
  } catch (err) {
    console.error("REGISTER ERROR:", err);
    return res.status(400).json({ message: err.message || "Registration failed" });
  }
});


router.post("/login", async (req, res) => {
  try {
    const { companyId, email, password } = req.body || {};

    if (email === (process.env.ADMIN_EMAIL || "") && password === (process.env.ADMIN_PASSWORD || "")) {
      
      const token = signToken({ userId: "admin", role: "admin" });
      return res.json({ token });
    }

    if (!companyId || !email || !password) {
      return res.status(400).json({ message: "Missing fields" });
    }

    const user = await User.findOne({ companyId, email: email.toLowerCase() });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(401).json({ message: "Invalid credentials" });

    const token = signToken({
      userId: user._id.toString(),
      companyId: user.companyId.toString(),
      role: user.role || "user"
    });

    return res.json({ token, 
  companyId: user.companyId.toString()});
  } 
  
  catch (err) {
    console.error("LOGIN ERROR:", err);
    return res.status(400).json({ message: err.message || "Login failed" });
  }
});

export default router;
