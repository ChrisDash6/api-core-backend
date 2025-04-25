const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });
const OnboardingService = require("../service/onboardingService");

exports.submitOnboarding = async (req, res) => {
  try {

    upload.any()(req, res, async (err) => {
      if (err) {
        return res.status(400).json({ error: "File upload failed: " + err.message });
      }

      if (!req.is("multipart/form-data")) {
        return res.status(400).json({ error: "Content-Type must be multipart/form-data" });
      }

      const empId = req.params.empId;
      const logId = req.body.logId;
      const notes = req.body.notes || "";

      if (!empId) return res.status(400).json({ error: "Employee ID is required in the URL." });
      if (!logId) return res.status(400).json({ error: "logId is required in form data." });

      if (!req.files || req.files.length === 0) {
        return res.status(400).json({ error: "No files uploaded. Please attach onboarding documents." });
      }

      const result = await OnboardingService.submitOnboardingRequest(empId, req.files, notes, logId);

      return res.status(201).json({
        message: "Onboarding documents submitted successfully.",
        onboardingData: result,
      });
    });
  } catch (error) {
    console.error("Onboarding Submission Failed:", error.message);
    return res.status(500).json({ error: "Submission failed: " + error.message });
  }
};


exports.getAllOnboardingRequests = async (req, res) => {
  try {
    const requests = await OnboardingService.fetchAllOnboardingRequests();

    res.status(200).json({
      message: "All onboarding requests fetched successfully",
      data: requests,
    });
  } catch (error) {
    console.error("Fetch Onboarding Error:", error.message);
    res.status(500).json({ error: "Failed to fetch onboarding requests: " + error.message });
  }
};
