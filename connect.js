require("dotenv").config(); // .env file को पढ़ने के लिए
const { MongoClient } = require("mongodb");

const uri = process.env.MONGO_URI; // .env से connection string लेना
const client = new MongoClient(uri);

async function main() {
  try {
    await client.connect();
    console.log("✅ MongoDB से connect हो गया!");

    // Database और collection चुनना
    const db = client.db("testDB");
    const collection = db.collection("users");

    // एक नया document insert करना
    const result = await collection.insertOne({
      name: "Rahul",
      job: "React Native Developer",
      learning: "Backend with Node.js"
    });

    console.log("नया document डाला गया, ID:", result.insertedId);

  } catch (error) {
    console.error("❌ Error:", error);
  } finally {
    await client.close(); // connection बंद करना
  }
}

main();