const mongoose = require("mongoose");
const path = require("path");
const fs = require("fs");
const Onboarding = require("../models/onboarding");
const { uploadFile } = require("../middlewares/fileStorageMiddlware");
const { DOCUMENT_TYPES } = require("../utils/documentTypes");

exports.submitOnboardingRequest = async (empId, files, notes = "", logId) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const existing = await Onboarding.findOne({ empId });
    if (existing) throw new Error("Onboarding request already submitted.");

    const folderPath = path.join(process.env.FILE_STORAGE_BASE_PATH, empId);
    if (!fs.existsSync(folderPath)) fs.mkdirSync(folderPath, { recursive: true });

    const documents = [];

    for (const file of files) {
      const docKey = file.fieldname;

      
      if (!DOCUMENT_TYPES.includes(docKey)) continue;

      const ext = path.extname(file.originalname);
      const finalName = `${empId}_${docKey}${ext}`;
      file.originalname = finalName;

      const filePath = await uploadFile(file, folderPath,finalName);

      documents.push({
        docType: docKey,
        fileName: finalName,
        status: "Pending",
        remarks: "",
        uploadedAt: new Date()
      });
    }

    const onboardingData = {
      empId,
      documents,  
      status: "Pending",
      submittedAt: new Date(),
      logId
    };

    const newRecord = new Onboarding(onboardingData);
    await newRecord.save({ session });

    await session.commitTransaction();
    session.endSession();

    return {
      message: "Onboarding submitted successfully",
      onboardingId: newRecord._id,
    };

  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw new Error(error.message);
  }
};

exports.fetchAllOnboardingRequests = async () => {
  const requests = await Onboarding.find({})
    .sort({ submittedAt: -1 })
    .select("-__v"); 
  return requests;
};
