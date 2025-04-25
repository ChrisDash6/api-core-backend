const mongoose = require("mongoose");
const Employee = require("../models/employee");
const Address = require("../models/address");
const { generateEmpId, generatePassword, hashPassword, } = require("../helpers/employeeHelper");
const { uploadFile } = require("../middlewares/fileStorageMiddlware");
const path = require("path");
const fs = require("fs");
const sendMail = require("../middlewares/mailSender");
const Department = require("../models/department");
const Designation = require("../models/designation");

const createEmployee = async (employeeData, files) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {

        // Generating  Employee ID & Secure Password
        const empId = await generateEmpId();
        const tempPassword = generatePassword(12);
        const hashedPassword = await hashPassword(tempPassword.trim());

        let imageFolderPath = null;
        let filePaths = {};

        if (files && files.length > 0) {
            // Constructing  Employee Folder Path
            imageFolderPath = path.join(process.env.FILE_STORAGE_BASE_PATH, empId);

            // Ensure Directory Exists
            if (!fs.existsSync(imageFolderPath)) {
                fs.mkdirSync(imageFolderPath, { recursive: true });
            }

            //Upload Each File & Store Paths
            for (const file of files) {
                const filePath = await uploadFile(file, imageFolderPath);
                if (!filePath) throw new Error(`File upload failed for ${file.originalname}`);
                filePaths[file.fieldname] = filePath;
            }
        }


        // Creating  Employee Iiitially Without Addresses
        const newEmployee = new Employee({
            ...employeeData,
            empId,
            password: hashedPassword,
            addresses: [],
            imageFolder: imageFolderPath
        });

        const savedEmployee = await newEmployee.save({ session });

        //  Insert Addresses based one empid generated  & obtaining ids for reference
        if (employeeData.addresses && employeeData.addresses.length > 0) {
            const addresses = employeeData.addresses.map((address) => ({
                ...address,
                empId,
            }));

            const savedAddresses = await Address.insertMany(addresses, { session });

            // Update Employee with Address references
            savedEmployee.addresses = savedAddresses.map((addr) => addr._id);
            await savedEmployee.save({ session });


        }

        const emailData = {
            name: `${employeeData.firstName} ${employeeData.lastName}`,
            email: employeeData.email,
            username: empId,
            password: tempPassword,
            subject: "Welcome to Our Company! Your Login Credentials",
            message: "Congratulations! You have been successfully onboarded. Use the credentials below to log in.",
            type: "Credentials",
        };

        await sendMail(emailData.name, emailData.email, emailData.username, emailData.password, emailData.subject, emailData.message, emailData.type);

        await session.commitTransaction();
        session.endSession();

        return {
            message: "Employee created successfully",
            empId,
            temporaryPassword: tempPassword,
            imageFolderPath: imageFolderPath

        };
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        console.error(" Creation Failed:", error.message);
        throw new Error(error.message);
    }
};

// handles fetch employee details 
const getAllEmployees = async () => {
    try {
        const employees = await Employee.find().populate("addresses").populate("roleRef", "roleName");
        const employeesList = employees.map(emp => emp.toObject());
        for (const emp of employeesList) {
            emp.departmentName = await getDepartmentName(emp.departmentId);
            emp.designationname = await getDesignationTitle(emp.designations);
        }
        return employeesList;
    } catch (error) {
        console.error("Error Fetching Employees:", error.message);
        throw new Error("Failed to fetch employees");
    }
};

const updateEmployee = async (empId, updatedData, files) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const existingEmployee = await Employee.findOne({ empId }).populate("addresses");

        if (!existingEmployee) {
            throw new Error("Employee not found");
        }

        const updateFields = {};
        Object.keys(updatedData).forEach((key) => {
            if (updatedData[key] !== undefined && updatedData[key] !== existingEmployee[key]) {
                updateFields[key] = updatedData[key];
            }
        });

        // Handle Address Updates Separately
        if (updatedData.addresses) {
            const updatedAddresses = updatedData.addresses;

            for (const address of updatedAddresses) {
                if (address._id) {
                    // Update existing address
                    await Address.findByIdAndUpdate(address._id, address, { session, new: true });
                } else {
                    // Create a new address if not present
                    const newAddress = await new Address({ ...address, empId }).save({ session });
                    existingEmployee.addresses.push(newAddress._id);
                }
            }

            updateFields.addresses = existingEmployee.addresses;
        }


        // Handle File Uploads 
        let imageFolderPath = existingEmployee.imageFolder;

        if (files && Object.keys(files).length > 0) {

            if (!imageFolderPath) {
                imageFolderPath = path.join(process.env.FILE_STORAGE_BASE_PATH, empId);
            }

            // Ensure Directory Exists
            if (!fs.existsSync(imageFolderPath)) {
                fs.mkdirSync(imageFolderPath, { recursive: true });
            }

            // Upload & Save Each File
            for (const fieldName in files) {
                const uploadedFile = files[fieldName];
                await uploadFile(uploadedFile, imageFolderPath);
            }

            updateFields.imageFolder = imageFolderPath;
        }

        // Perform Update with `$set` operator
        const updatedEmployee = await Employee.findOneAndUpdate(
            { empId },
            { $set: updateFields },
            { new: true, session }
        ).populate("addresses");

        await session.commitTransaction();
        session.endSession();

        return updatedEmployee;
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        throw new Error(error.message);
    }
};

//getting employee based on Id
const getEmployeeById = async (empId) => {
    try {

        const employeeData = await Employee.findOne({ empId: empId, status: "active" })
            .populate("addresses").populate("roleRef", "roleName").select("-password -createdAt -updatedAt -__v");


        const populatedEmpData = employeeData.toObject(); // Convert Mongoose doc to plain JS object
        populatedEmpData.departmentName = await getDepartmentName(employeeData.departmentId);
        populatedEmpData.designationName = await getDesignationTitle(employeeData.designations);
        return populatedEmpData

    } catch (error) {
        console.error("Error Fetching Employees:", error.message);
        throw new Error("Failed to fetch employees");
    }
}

const getDepartmentName = async (departmentId) => {
    if (!departmentId) return null;
    const department = await Department.findOne({ departmentId }).select("departmentName");
    return department ? department.departmentName : null;
};


const getDesignationTitle = async (designationId) => {
    if (!designationId) return null;
    const designation = await Designation.findOne({ designationId }).select("title");
    return designation ? designation.title : null;
};

module.exports = { getDepartmentName, getDesignationTitle, getEmployeeById, createEmployee, getAllEmployees, updateEmployee };