require("dotenv").config();
const { MongoClient } = require("mongodb");

const uri = process.env.MONGO_URI;
const client = new MongoClient(uri);

async function main() {
  try {
    await client.connect();
    console.log("✅ Connected!\n");

    const db = client.db("testDB");
    const collection = db.collection("users");

    // ============================
    // CREATE — नया data डालना
    // ============================
    await collection.insertOne({
      name: "Priya",
      job: "Backend Developer",
      age: 24
    });
    console.log("✅ CREATE — Priya add हो गई\n");

    // ============================
    // READ — सारा data निकालना
    // ============================
    const allUsers = await collection.find({}).toArray();
    console.log("📋 READ — सारे users:");
    console.log(allUsers, "\n");

    // READ — एक specific user ढूंढना
    const oneUser = await collection.findOne({ name: "Rahul" });
    console.log("🔍 READ — सिर्फ Rahul:");
    console.log(oneUser, "\n");

    // ============================
    // UPDATE — data बदलना
    // ============================
    await collection.updateOne(
      { name: "Rahul" },               // किसको ढूंढना है
      { $set: { age: 26 } }            // क्या बदलना है
    );
    console.log("✏️ UPDATE — Rahul की age 26 हो गई\n");

    // ============================
    // DELETE — data हटाना
    // ============================
    await collection.deleteOne({ name: "Priya" });
    console.log("🗑️ DELETE — Priya हटा दी गई\n");

    // आख़िर में फिर से सब data दिखाएं
    const finalUsers = await collection.find({}).toArray();
    console.log("📋 आख़िरी data:");
    console.log(finalUsers);

  } catch (error) {
    console.error("❌ Error:", error);
  } finally {
    await client.close();
  }
}

main();