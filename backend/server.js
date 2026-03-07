import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import http from "http";
import connectDB from "./config/db.js";
import { initSocket } from "./socket.js";

import authRoutes from "./routes/authRoutes.js";
import projectRoutes from "./routes/projectRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";
import activityRoutes from "./routes/activityRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";

dotenv.config();

const app = express();

/* ---------- MIDDLEWARE ---------- */
app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://togglenest123.netlify.app"
  ],
  credentials: true
}));
app.use(express.json());

/* ---------- DB ---------- */
connectDB();

/* ---------- ROUTES ---------- */
app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/activities", activityRoutes);
app.use("/api/users", userRoutes);
app.use("/api/ai", aiRoutes);

/* ---------- TEST ---------- */
app.get("/", (req, res) => {
  res.send("ToggleNest Backend is running 🚀");
});



/* ---------- CREATE ONE SERVER ---------- */
const server = http.createServer(app);

/* ---------- INIT SOCKET ---------- */
initSocket(server);

/* ---------- START SERVER ---------- */
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server + Socket running on port ${PORT}`);
});
