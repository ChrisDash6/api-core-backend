const bcrypt = require('bcryptjs');
const redisClient = require('../utils/redisConfig');
const Employee = require('../models/employee.js');
const { generateAccessToken, createRefreshToken } = require('../utils/jwtUtility');
const { v4: uuidv4 } = require('uuid');
const useragent = require('useragent');
const { getDepartmentName, getDesignationTitle } = require('../service/employeeService.js');

const login = async (empId, password, req) => {
  const employeeId = String(empId).trim();

  try {
    const employee = await Employee.findOne({ empId: employeeId, status: 'active' })
      .populate('roleRef', 'roleName')
      .populate('addresses');

    if (!employee) throw new Error('No employee exists with this Employee ID');

    const isMatch = await bcrypt.compare(password, employee.password);
    if (!isMatch) throw new Error('Invalid credentials! Please enter valid credentials');

    const accessToken = generateAccessToken(empId, employee.role);
    const { refreshToken, sessionId } = await createRefreshToken(empId);

    const userAgent = useragent.parse(req.headers['user-agent'] || '');

    const sessionData = {
      token: refreshToken,
      ip: req.ip || 'unknown',
      browser: userAgent.family || 'unknown',
      os: userAgent.os.family || 'unknown',
      createdAt: new Date().toISOString(),
    };

    const sessionKey = `${process.env.NODE_ENV || 'dev'}:session:${employeeId}:${sessionId}`;

    try {
      // Directly use hSet and expire commands
      await redisClient.hSet(sessionKey, sessionData);  // hSet command in the newer Redis client
      await redisClient.expire(sessionKey, 7 * 24 * 60 * 60); // Expiry in seconds
    } catch (error) {
      console.error('Error storing session in Redis:', {
        error: error.message,
        stack: error.stack,
        sessionKey,
        sessionData,
      });
      throw new Error(`Failed to store session in Redis: ${error.message}`);
    }

    const tempEmployee = employee.toObject();
    tempEmployee.departmentName = await getDepartmentName(tempEmployee.departmentId);
    tempEmployee.designationName = await getDesignationTitle(tempEmployee.designations);

    return { accessToken, refreshToken, sessionId, tempEmployee };
  } catch (error) {
    console.error('Login error:', {
      error: error.message,
      stack: error.stack,
      empId: employeeId,
    });
    throw error; // Propagate original error
  }
};

module.exports = { login };
