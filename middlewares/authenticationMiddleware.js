const { verifiedToken } = require("../utils/jwtUtility");
const redisClient = require("../utils/redisConfig");

const verifySession = async (req, res, next) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json({ message: "Access Denied" });

  try {
    const decoded = verifiedToken(token, process.env.JWT_SECRET_KEY);
   

    req.user = decoded;

    const sessions = await redisClient.keys(`session:${decoded.traineeId}:*`);
    if (sessions.length === 0) {
      return res.status(401).json({ message: "Session Expired. Please login again." });
    }

    next();
  } catch (err) {
    res.status(403).json({ message: "Invalid Token" });
  }
};

module.exports = verifySession;
