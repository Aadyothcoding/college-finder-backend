import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import matchRoute from "./routes/match.js";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

app.use("/api", matchRoute);
app.get("/", (req, res) => {
  res.send("🎯 College Finder API is up!");
});


const PORT = process.env.PORT ;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
