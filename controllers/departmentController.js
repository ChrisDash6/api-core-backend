const DepartmentService = require("../service/departmentService");
  

exports.addDepartment = async (req, res) => {
    try {
      console.log("🔍 Incoming Department Request:", req.body);
  
      //Calling  Service Layer for Validation & saving 
      const response = await DepartmentService.createDepartment(req.body);
  
      // Send Success Response
      return res.status(201).json(response);
    } catch (error) {
      console.error("Error Adding Department:", error.message);
      return res.status(500).json({ error: "Failed to add department. " + error.message });
    }
};

exports.getAllDepartments = async (req, res) => {
    try {
      const departments = await DepartmentService.fetchDepartments();
      return res.status(200).json(departments);
    } catch (error) {
      console.error("Error Fetching Departments:", error.message);
      return res.status(500).json({ error: "Fetching departments failed: " + error.message });
    }
};