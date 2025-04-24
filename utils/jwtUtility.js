const jsonwebtoken = require("jsonwebtoken");
const crypto = require("crypto");
const redisClient = require("../utils/redisConfig");

const generateTokenId = () => crypto.randomBytes(16).toString("hex");

// Generating JWT Access Token
const generateAccessToken = (traineeId, role) => {
    return jsonwebtoken.sign({ traineeId, role }, process.env.JWT_SECRET_KEY, {
        expiresIn: process.env.JWT_ACCESS_EXPIRY,
    });
};

// creating the reftresh token  for first-time login 
const createRefreshToken = async (traineeId) => {
    const tokenId = generateTokenId();
    const refreshToken = jsonwebtoken.sign(
        { traineeId, tokenId },
        process.env.JWT_REFRESH_SECRET_KEY,
        { expiresIn: process.env.JWT_REFRESH_EXPIRY }
    );

    // Storing  refresh token in Redis for session management 
    const sessionId = generateTokenId();
    try {
        await redisClient.hSet(`session:${traineeId}:${sessionId}`, {
            token: refreshToken,
            createdAt: new Date().toISOString(),
        });
        await redisClient.expire(`session:${traineeId}:${sessionId}`, 7 * 24 * 60 * 60);
    } catch (error) {
        console.error("Redis Error:", error.message);
        throw new Error("Internal server error while storing refresh token");
    }

    return { refreshToken, sessionId };
};

// generating the refresh token upon the expiry of token requests
const generateRefreshToken = async (req, res) => {
    try {
        // Extract refresh token from request body
        const { refreshToken } = req.body;
        if (!refreshToken) {
            return res.status(400).json({ message: "Refresh token required" });
        }
        // Verify the refresh token
        let decoded;
        try {
            decoded = jsonwebtoken.verify(refreshToken, process.env.JWT_REFRESH_SECRET_KEY);
        } catch (error) {
            return res.status(401).json({ message: "Invalid or expired refresh token" });
        }

        const traineeId = decoded.traineeId;

        // Checking if the refresh token exists in Redis 
        const sessionKeyPattern = `session:${traineeId}:*`;
        const sessions = await redisClient.keys(sessionKeyPattern);

        let validSession = false;
        for (const session of sessions) {
            const sessionData = await redisClient.hGetAll(session);
            if (sessionData.token === refreshToken) {
                validSession = true;
                await redisClient.del(session);
                break;
            }
        }

        if (!validSession) return res.status(401).json({ message: "Invalid session. Please log in again." });

        // Generate a new access token
        const accessToken = jsonwebtoken.sign(
            { traineeId },
            process.env.JWT_SECRET_KEY,
            { expiresIn: process.env.JWT_ACCESS_EXPIRY }
        );


        const refreshTokenExp = decoded.exp * 1000;
        const timeLeft = refreshTokenExp - Date.now();
        const refreshThreshold = 5 * 60 * 1000;

        let newRefreshToken = refreshToken;
        if (timeLeft < refreshThreshold) {
            const { refreshToken: newToken } = await createRefreshToken(traineeId);
            newRefreshToken = newToken;
        }

        res.json({ accessToken, refreshToken: newRefreshToken });
    } catch (error) {
        console.error("Error refreshing token:", error.message);
        return res.status(500).json({ message: "Error refreshing token" });
    }
};

// token verification
const verifiedToken = (token, secret) => {
    return jsonwebtoken.verify(token, secret);
};

module.exports = {
    generateAccessToken,
    generateRefreshToken,
    createRefreshToken,
    verifiedToken
};
