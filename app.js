require("dotenv").config();
const express = require("express");
const { MongoClient } = require("mongodb");

const app = express();
app.use(express.json());

const uri = process.env.MONGO_URI;
const client = new MongoClient(uri);

let db; // यहाँ हम database को save रखेंगे, हर request के लिए दोबारा connect नहीं करेंगे

// ============================
// Server शुरू होने से पहले एक बार DB connect करना
// ============================
async function connectDB() {
  await client.connect();
  db = client.db("testDB");
  console.log("✅ MongoDB से connect हो गया!");
}

// ============================
// ROUTE 1 — सारे users लाना
// ============================
app.get("/users", async (req, res) => {
  try {
    const users = await db.collection("users").find({}).toArray();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: "कुछ गलत हो गया" });
  }
});

// ============================
// ROUTE 2 — नया user बनाना
// ============================
app.post("/users", async (req, res) => {
  try {
    const { name, job } = req.body;

    if (!name || !job) {
      return res.status(400).json({ error: "name और job दोनों चाहिए" });
    }

    const result = await db.collection("users").insertOne({ name, job });
    res.status(201).json({ message: "User बन गया", id: result.insertedId });
  } catch (error) {
    res.status(500).json({ error: "कुछ गलत हो गया" });
  }
});

// ============================
// Server शुरू करना — पहले DB connect हो, फिर server चले
// ============================
const PORT = 5000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server http://localhost:${PORT} पर चल रहा है`);
  });
});