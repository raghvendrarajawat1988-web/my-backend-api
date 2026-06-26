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
// ROUTE 3 — किसी user को update करना
// ============================
app.put("/users/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, job } = req.body;
    const { ObjectId } = require("mongodb");

    const result = await db.collection("users").updateOne(
      { _id: new ObjectId(id) },
      { $set: { name, job } }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: "User नहीं मिला" });
    }

    res.status(200).json({ message: "User update हो गया" });
  } catch (error) {
    res.status(500).json({ error: "कुछ गलत हो गया" });
  }
});

// ============================
// ROUTE 4 — किसी user को delete करना
// ============================
app.delete("/users/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { ObjectId } = require("mongodb");

    const result = await db.collection("users").deleteOne({
      _id: new ObjectId(id)
    });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: "User नहीं मिला" });
    }

    res.status(200).json({ message: "User delete हो गया" });
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