require("dotenv").config();
const express = require("express");
const { connectDB } = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");

const app = express();
app.use(express.json());

// Routes जोड़ना
app.use("/auth", authRoutes);   // /auth/signup, /auth/login
app.use("/", userRoutes);        // /users (protected)

const PORT = 5000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server http://localhost:${PORT} पर चल रहा है`);
  });
});