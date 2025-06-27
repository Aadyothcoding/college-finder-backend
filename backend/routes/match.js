import express from "express";
import { findMatchingUniversities } from "../utils/llamaAgent.js";

const router = express.Router();

router.post("/match", async (req, res) => {
  console.log("📥 Received POST at /api/match");
  console.log("➡️ Body:", JSON.stringify(req.body, null, 2));

  try {
    const result = await findMatchingUniversities(req.body);
    console.log("✅ Match Result:", JSON.stringify(result, null, 2));
    res.json({ success: true, matches: result.matches });
  } catch (err) {
    console.error("❌ Match Error:", err.message);
    res.status(500).json({ success: false, message: "Match failed." });
  }
});

export default router;
