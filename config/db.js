const { MongoClient } = require("mongodb");

const uri = process.env.MONGO_URI;
const client = new MongoClient(uri);

let db;

async function connectDB() {
  await client.connect();
  db = client.db("testDB");
  console.log("✅ MongoDB से connect हो गया!");
  return db;
}

function getDB() {
  return db;
}

module.exports = { connectDB, getDB };