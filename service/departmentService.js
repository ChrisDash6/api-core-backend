const Department = require("../models/department");
const { generateDeptId } = require("../helpers/traineeHelper"); // Helper for department ID generation

exports.createDepartment = async (departmentData) => {
  try {
    console.log("Validating Department Data:", departmentData);

    // Validate Required Fields
    const requiredFields = ["departmentName", "departmentAcronym", "deptHead","logId"];
    for (const field of requiredFields) {
      if (!departmentData[field] || departmentData[field].trim() === "") {
        throw new Error(`${field} is required.`);
      }
    }

    // Check if department name or acronym already exists
    const existingDepartment = await Department.findOne({
      $or: [
        { departmentName: departmentData.departmentName },
        { departmentAcronym: departmentData.departmentAcronym },
        {departmentId:departmentData.departmentId}
      ]
    });

    if (existingDepartment) {
      throw new Error("Department name or acronym already exists.");
    }

    // Generate Unique Department ID
    const departmentId = await generateDeptId();

    // Create New Department Object
    const newDepartment = new Department({
      departmentId,
      departmentName: departmentData.departmentName,
      departmentAcronym: departmentData.departmentAcronym,
      description: departmentData.description || "",
      deptHead: departmentData.deptHead || null,
      status: departmentData.status || "active",
      logId: departmentData.logId,
    });

    // Save Department in Database
    const savedDepartment = await newDepartment.save();

    console.log("Department Created Successfully:", savedDepartment);
    return { message: "Department added successfully", departmentId };
  } catch (error) {
    console.error("Error Creating Department:", error.message);
    throw new Error(error.message);
  }
};

exports.fetchDepartments = async () => {
    try {
      // Fetching  all departments
      const departments = await Department.find({}).select("-__v -logId -updatedAt -createdAt -description"); 
  
      if (!departments || departments.length === 0) {
        throw new Error("No departments found");
      }
  
      return { message: "Departments retrieved successfully", departments };
    } catch (error) {
      console.error("Error Fetching Departments:", error.message);
      throw new Error(error.message);
    }
  };
