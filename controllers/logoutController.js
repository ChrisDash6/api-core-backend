const redisClient = require("../utils/redisConfig");
const jwt = require("jsonwebtoken");

const logoutController = async (req, res) => {
    try {
        const { sessionId } = req.body;
        const accessToken = req.headers.authorization?.split(" ")[1]; 

        if (!sessionId || !accessToken) {
            return res.status(400).json({ message: "Session ID and access token are required" });
        }

        // Verify Access Token and Extract empId
        let decoded;
        try {
            decoded = jwt.verify(accessToken, process.env.JWT_SECRET_KEY);
        } catch (error) {
            return res.status(401).json({ message: "Invalid or expired access token" });
        }
        const empId = decoded.empId;

        // Checking  if the session belongs to the same employee
        const sessionKey = `session:${empId}:${sessionId}`;
        const sessionExists = await redisClient.exists(sessionKey);

        if (!sessionExists) {
            return res.status(403).json({ message: "Access Denied: Session does not belong to this user" });
        }

        // Deleting the  session from Redis
        await redisClient.del(sessionKey);
        

        //Clearing the  authentication cookies
        res.clearCookie("accessToken");
        res.clearCookie("refreshToken");

        return res.json({ message: "Logout successful" });
    } catch (error) {
        console.error("Error logging out:", error.message);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

module.exports = { logoutController };