const { login } = require("../service/authenticationService");
const EmployeeResponse = require("../helpers/employeeResponse");
const { generateRefreshToken } = require("../utils/jwtUtility");


const loginController = async (req, res) => {
  try {
    if (!req.body || !req.body.empId || !req.body.password) {
      return res.status(400).json({ message: "empId and password are required" });
    }

    const { empId, password } = req.body;
    const { accessToken, refreshToken, sessionId, tempEmployee} = await login(empId, password, req);
    const empBean = EmployeeResponse.fromEntity(tempEmployee);

    //Setting the  cookies
    res.cookie("accessToken", accessToken, { httpOnly: true, secure: true, sameSite: "strict" });
    res.cookie("refreshToken", refreshToken, { httpOnly: true, secure: true, sameSite: "strict" });

    return res.json({ message: "Login successful", sessionId ,accessToken,empBean});
  } catch (err) {
    console.error("Login error:", err.message);
    return res.status(err.message === "Invalid credentials" ? 401 : 500).json({ message: err.message });
  }
};

const refreshTokenController = async (req, res) => {
  try {
      return generateRefreshToken(req, res);
  } catch (error) {
      console.error("Error refreshing token:", error.message);
      return res.status(500).json({ message: "Internal Server Error" });
  }
};



module.exports = { loginController,refreshTokenController };