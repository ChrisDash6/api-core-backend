const express = require("express");
const router = express.Router();
const EmployeeController = require("../controllers/employeeController");
const verifySession = require("../middlewares/authenticationMiddleware"); 
const upload = require("../middlewares/fileStorageMiddlware");

// employee creation route
router.post("/empAdd", verifySession, EmployeeController.addEmployee);
router.get("/employees", verifySession,EmployeeController.getAllEmployees);
router.put("/:empId", verifySession,EmployeeController.updateEmployee);
router.get("/:empId",verifySession,EmployeeController.getEmployeeById);
router.patch("/:empId/updateEmployeeStatus", verifySession, EmployeeController.updateEmployeeStatus);



module.exports = router;
