const mongoose = require("mongoose");
const Trainee = require("../models/trainee");
const Address = require("../models/address");
const { generateTraineeId, generatePassword, hashPassword } = require("../helpers/traineeHelper");
const { uploadFile } = require("../middlewares/fileStorageMiddlware");
const path = require("path");
const fs = require("fs");
const sendMail = require("../middlewares/mailSender");
const Department = require("../models/department");
const Designation = require("../models/designation");

const createTrainee = async (traineeData, files) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {

    // Generating Trainee ID & Secure Password
    const traineeId = await generateTraineeId();
    const tempPassword = generatePassword(12);
    const hashedPassword = await hashPassword(tempPassword.trim());

    let imageFolderPath = null;
    let filePaths = {};

    if (files && files.length > 0) {
      // Constructing Trainee Folder Path
      imageFolderPath = path.join(process.env.FILE_STORAGE_BASE_PATH, traineeId);

      // Ensure Directory Exists
      if (!fs.existsSync(imageFolderPath)) {
        fs.mkdirSync(imageFolderPath, { recursive: true });
      }

      // Upload Each File & Store Paths
      for (const file of files) {
        const filePath = await uploadFile(file, imageFolderPath,"");
        if (!filePath) throw new Error(`File upload failed for ${file.originalname}`);
        filePaths[file.fieldname] = filePath;
      }
    }

    // Creating Trainee Initially Without Addresses
    const newTrainee = new Trainee({
      ...traineeData,
      traineeId,
      password: hashedPassword,
      addresses: [],
      imageFolder: imageFolderPath
    });

    const savedTrainee = await newTrainee.save({ session });

    // Insert Addresses based on traineeId generated & obtaining ids for reference
    if (traineeData.addresses && traineeData.addresses.length > 0) {
      const addresses = traineeData.addresses.map((address) => ({
        ...address,
        traineeId,
      }));

      const savedAddresses = await Address.insertMany(addresses, { session });

      // Update Trainee with Address references
      savedTrainee.addresses = savedAddresses.map((addr) => addr._id);
      await savedTrainee.save({ session });
    }

    const emailData = {
      name: `${traineeData.firstName} ${traineeData.lastName}`,
      email: traineeData.email,
      username: traineeId,
      password: tempPassword,
      subject: "Welcome to Our Company! Your Login Credentials",
      message: "Congratulations! You have been successfully onboarded. Use the credentials below to log in.",
      type: "Credentials",
    };

    await sendMail(emailData.name, emailData.email, emailData.username, emailData.password, emailData.subject, emailData.message, emailData.type);

    await session.commitTransaction();
    session.endSession();

    return {
      message: "Trainee created successfully",
      traineeId,
      temporaryPassword: tempPassword,
      imageFolderPath: imageFolderPath
    };
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error("Creation Failed:", error.message);
    throw new Error(error.message);
  }
};

// handles fetch trainee details
const getAllTrainees = async () => {
  try {
    const trainees = await Trainee.find().populate("addresses").populate("roleRef", "roleName");
    const traineesList = trainees.map(trainee => trainee.toObject());
    for (const trainee of traineesList) {
      trainee.departmentName = await getDepartmentName(trainee.departmentId);
      trainee.designationName = await getDesignationTitle(trainee.designations);
    }
    return traineesList;
  } catch (error) {
    console.error("Error Fetching Trainees:", error.message);
    throw new Error("Failed to fetch trainees");
  }
};

const updateTrainee = async (traineeId, updatedData, files) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const existingTrainee = await Trainee.findOne({ traineeId }).populate("addresses");

    if (!existingTrainee) {
      throw new Error("Trainee not found");
    }

    const updateFields = {};
    Object.keys(updatedData).forEach((key) => {
      if (updatedData[key] !== undefined && updatedData[key] !== existingTrainee[key]) {
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
          const newAddress = await new Address({ ...address, traineeId }).save({ session });
          existingTrainee.addresses.push(newAddress._id);
        }
      }

      updateFields.addresses = existingTrainee.addresses;
    }

    // Handle File Uploads 
    let imageFolderPath = existingTrainee.imageFolder;

    if (files && Object.keys(files).length > 0) {

      if (!imageFolderPath) {
        imageFolderPath = path.join(process.env.FILE_STORAGE_BASE_PATH, traineeId);
      }

      // Ensure Directory Exists
      if (!fs.existsSync(imageFolderPath)) {
        fs.mkdirSync(imageFolderPath, { recursive: true });
      }

      // Upload & Save Each File
      for (const fieldName in files) {
        const uploadedFile = files[fieldName];
        await uploadFile(uploadedFile, imageFolderPath,"");
      }

      updateFields.imageFolder = imageFolderPath;
    }

    // Perform Update with `$set` operator
    const updatedTrainee = await Trainee.findOneAndUpdate(
      { traineeId },
      { $set: updateFields },
      { new: true, session }
    ).populate("addresses");

    await session.commitTransaction();
    session.endSession();

    return updatedTrainee;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw new Error(error.message);
  }
};

// Getting trainee based on Id
const getTraineeById = async (traineeId) => {
  try {
    const traineeData = await Trainee.findOne({ traineeId: traineeId, status: "active" })
      .populate("addresses").populate("roleRef", "roleName").select("-password -createdAt -updatedAt -__v");

    const populatedTraineeData = traineeData.toObject(); // Convert Mongoose doc to plain JS object
    populatedTraineeData.departmentName = await getDepartmentName(traineeData.departmentId);
    populatedTraineeData.designationName = await getDesignationTitle(traineeData.designations);
    return populatedTraineeData;

  } catch (error) {
    console.error("Error Fetching Trainees:", error.message);
    throw new Error("Failed to fetch trainees");
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

module.exports = { getDepartmentName, getDesignationTitle, getTraineeById, createTrainee, getAllTrainees, updateTrainee };
