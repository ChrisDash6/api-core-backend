const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const redisClient = require('../utils/redisConfig');

const generateTokenId = () => crypto.randomBytes(16).toString('hex');

// Generate JWT Access Token
const generateAccessToken = (empId, role) => {
    return jwt.sign({ empId, role }, process.env.JWT_SECRET_KEY, {
        expiresIn: process.env.JWT_ACCESS_EXPIRY,
    });
};

// Create refresh token for first-time login
const createRefreshToken = async (empId) => {
    const tokenId = generateTokenId();
    const refreshToken = jwt.sign(
        { empId, tokenId },
        process.env.JWT_REFRESH_SECRET_KEY,
        { expiresIn: process.env.JWT_REFRESH_EXPIRY }
    );

    const sessionId = generateTokenId();
    const refreshKey = `${process.env.NODE_ENV || 'dev'}:refresh:${empId}:${sessionId}`;

    try {
        
        await redisClient.hSet(refreshKey, 'token', refreshToken, 'createdAt', new Date().toISOString());
        await redisClient.expire(refreshKey, 7 * 24 * 60 * 60); 
        return { refreshToken, sessionId };
    } catch (error) {
        console.error('Error storing refresh token in Redis:', {
            error: error.message,
            stack: error.stack,
            refreshKey,
            empId,
        });
        throw new Error(`Failed to store refresh token in Redis: ${error.message}`);
    }
};

// Generate refresh token upon expiry
const generateRefreshToken = async (req, res) => {
    try {
        const { refreshToken } = req.body;
        if (!refreshToken) {
            return res.status(400).json({ message: 'Refresh token required' });
        }

        let decoded;
        try {
            decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET_KEY);
        } catch (error) {
            return res.status(401).json({ message: 'Invalid or expired refresh token' });
        }

        const empId = decoded.empId;
        const sessionKeyPattern = `${process.env.NODE_ENV || 'dev'}:refresh:${empId}:*`;
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

        if (!validSession) {
            return res.status(401).json({ message: 'Invalid session. Please log in again.' });
        }

        const accessToken = jwt.sign(
            { empId },
            process.env.JWT_SECRET_KEY,
            { expiresIn: process.env.JWT_ACCESS_EXPIRY }
        );

        const refreshTokenExp = decoded.exp * 1000;
        const timeLeft = refreshTokenExp - Date.now();
        const refreshThreshold = 5 * 60 * 1000;

        let newRefreshToken = refreshToken;
        if (timeLeft < refreshThreshold) {
            const { refreshToken: newToken } = await createRefreshToken(empId);
            newRefreshToken = newToken;
        }

        res.json({ accessToken, refreshToken: newRefreshToken });
    } catch (error) {
        console.error('Error refreshing token:', {
            error: error.message,
            stack: error.stack,
        });
        return res.status(500).json({ message: 'Error refreshing token' });
    }
};

// Token verification
const verifiedToken = (token, secret) => {
    return jwt.verify(token, secret);
};

module.exports = {
    generateAccessToken,
    generateRefreshToken,
    createRefreshToken,
    verifiedToken,
};
