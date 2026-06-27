const jwt = require("jsonwebtoken");

function verifyToken(req, res, next) {
  // Header से token निकालना — "Bearer xxxxx" format में आता है
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: "Token नहीं मिला, login करें पहले" });
  }

  const token = authHeader.split(" ")[1]; // "Bearer" शब्द हटाकर सिर्फ token लेना

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // user की जानकारी request में जोड़ दी, आगे इस्तेमाल के लिए
    next(); // सब ठीक है, आगे बढ़ने दो route तक
  } catch (error) {
    return res.status(403).json({ error: "Token गलत या expire हो गया" });
  }
}

module.exports = verifyToken;