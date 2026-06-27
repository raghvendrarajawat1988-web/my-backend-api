const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { ObjectId } = require("mongodb");
const { getDB } = require("../config/db");

// ============================
// SIGNUP — नया account बनाना
// ============================
async function signup(req, res) {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: "name, email और password तीनों चाहिए" });
    }

    const db = getDB();
    const usersCollection = db.collection("auth_users");

    // चेक करें — क्या ये email पहले से registered है?
    const existingUser = await usersCollection.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "ये email पहले से registered है" });
    }

    // Password को hash करना — असली password कभी save नहीं होता
    const hashedPassword = await bcrypt.hash(password, 10);

    // नया user बनाना
    const result = await usersCollection.insertOne({
      name,
      email,
      password: hashedPassword  // hash किया हुआ password save हो रहा है
    });

    res.status(201).json({ message: "Account बन गया!", userId: result.insertedId });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "कुछ गलत हो गया" });
  }
}

// ============================
// LOGIN — user को verify करना और token देना
// ============================
async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "email और password दोनों चाहिए" });
    }

    const db = getDB();
    const usersCollection = db.collection("auth_users");

    // User को email से ढूंढना
    const user = await usersCollection.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: "गलत email या password" });
    }

    // Password को compare करना (hash से)
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(401).json({ error: "गलत email या password" });
    }

    // सब सही — अब JWT token बनाते हैं
    const token = jwt.sign(
      { userId: user._id, email: user.email },  // token के अंदर क्या जानकारी रहेगी
      process.env.JWT_SECRET,                    // secret key (sign करने के लिए)
      { expiresIn: "7d" }                          // token 7 दिन तक valid रहेगा
    );

    res.status(200).json({
      message: "Login हो गया!",
      token: token,
      user: { name: user.name, email: user.email }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "कुछ गलत हो गया" });
  }
}

module.exports = { signup, login };