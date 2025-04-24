const bcrypt = require("bcryptjs");
const redisClient = require("../utils/redisConfig");
const Trainee = require("../models/trainee.js");
const { generateAccessToken, createRefreshToken } = require("../utils/jwtUtility"); 
const { v4: uuidv4 } = require("uuid");
const useragent = require("useragent");
const { getDepartmentName, getDesignationTitle } = require("../service/traineeService.js"); 

const login = async (traineeId, password, req) => {
  const traineeIdString = String(traineeId).trim();
 
  const trainee = await Trainee.findOne({ traineeId: traineeIdString, status: "active" }).populate("roleRef", "roleName").populate("addresses");
  
  if (!trainee) throw new Error("No trainee exists with this Trainee ID");

  const isMatch = await bcrypt.compare(password, trainee.password);
  if (!isMatch) throw new Error("Invalid credentials! Please enter valid credentials");

  //Generating the JWT access token
  const accessToken = generateAccessToken(traineeId, trainee.role);

  // First time login using create refresh token for session refresh and all state management
  const { refreshToken, sessionId } = await createRefreshToken(traineeId); 

  const userAgent = useragent.parse(req.headers["user-agent"]);

  const sessionData = {
    token: refreshToken,
    ip: req.ip,
    browser: userAgent.family,
    os: userAgent.os.family,
    createdAt: new Date().toISOString()
  };

  const tempTrainee = trainee.toObject();
  tempTrainee.departmentName = await getDepartmentName(tempTrainee.departmentId);
  tempTrainee.designationName = await getDesignationTitle(tempTrainee.designations);

  try {
    await redisClient.hSet(`session:${traineeId}:${sessionId}`, sessionData);
    await redisClient.expire(`session:${traineeId}:${sessionId}`, 7 * 24 * 60 * 60);
  } catch (error) {
    console.error("Error storing session in Redis:", error);
    throw new Error("Internal server error during session management");
  }
  return { accessToken, refreshToken, sessionId, tempTrainee }; 
};

module.exports = { login };
