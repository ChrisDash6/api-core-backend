const Designation = require("../models/designation");
const { generateDesignationId } = require("../helpers/traineeHelper");

exports.createDesignation = async (designationData) => {
    try {
        console.log("Validating Department Data:", designationData);

        // Validate Required Fields
        const requiredFields = ["title", "departmentId", "reportsTo", "gradeLevel", "salaryRange", "status", "logId"];
        for (const field of requiredFields) {
            if (!designationData[field] || designationData[field].trim() === "") {
                throw new Error(`${field} is required.`);
            }
        }

        // Find an existing designation with all four fields matching
        const existingDesignation = await Designation.findOne({
            designationId: designationData.designationId,
            title: designationData.title,
            departmentId: designationData.departmentId,
            status: designationData.status
        });

        if (existingDesignation) {
            throw new Error("A designation with the same ID, title, department, and status already exists.");
        }
        // Generate Unique Department ID
        const designationId = await generateDesignationId();

        // Create New Department Object
        const newDesignation = new Designation({
            designationId,
            title: designationData.title,
            departmentId: designationData.departmentId,
            reportsTo: designationData.reportsTo,
            gradeLevel: designationData.gradeLevel,
            status: designationData.status || "active",
            salaryRange: designationData.salaryRange,
            logId: designationData.logId,
        });

        // Save DESIGNATION in Database
        const savedDesignation = await newDesignation.save();

        console.log("Designation Created Successfully:", savedDesignation);
        return { message: "Designation added successfully", designationId };
    } catch (error) {
        console.error("Error Creating Designation:", error.message);
        throw new Error(error.message);
    }
};

exports.fetchDesignations = async () => {
    try {
        // Fetching  all designations
        const designations = await Designation.find({}).select("-__v -logId -updatedAt -createdAt -description");

        if (!designations || designations.length === 0) {
            throw new Error("No designations found");
        }

        return { message: "designations retrieved successfully", designations };
    } catch (error) {
        console.error("Error Fetching designations:", error.message);
        throw new Error(error.message);
    }
};
