const TraineeService = require("../service/traineeService");
const TraineeRequest = require("../helpers/traineeRequest");
const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });

exports.addTrainee = async (req, res) => {
  upload.any()(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ error: "File upload failed: " + err.message });
    }
    try {
      if (!req.body || Object.keys(req.body).length === 0) {
        return res.status(400).json({ error: "No data received. Ensure you're sending multipart/form-data." });
      }

      let addresses = [];
      try {
        addresses = req.body.addresses ? JSON.parse(req.body.addresses) : [];
      } catch (error) {
        return res.status(400).json({ error: "Invalid addresses format." });
      }

      const traineeData = new TraineeRequest(req.body);
      console.log(traineeData);

      traineeData.addresses = addresses;

      const errors = TraineeRequest.validate(traineeData);
      if (errors) return res.status(400).json({ error: errors });

      const response = await TraineeService.createTrainee(traineeData, req.files);
      res.status(201).json(response);
    } catch (error) {
      console.error("Error:", error.message);
      res.status(500).json({ error: "Creating trainee failed: " + error.message });
    }
  });
};

exports.getAllTrainees = async (req, res) => {
  try {
    const trainees = await TraineeService.getAllTrainees();

    if (!trainees || trainees.length === 0) {
      return res.status(404).json({ message: "No trainees found." });
    }

    return res.status(200).json({
      message: "Trainees retrieved successfully.",
      trainees,
    });
  } catch (error) {
    console.error("Error Fetching Trainees:", error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.updateTrainee = async (req, res) => {
  upload.any()(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ error: "File upload failed: " + err.message });
    }

    try {
      const traineeId = req.params.traineeId;

      if (!req.body || Object.keys(req.body).length === 0) {
        return res.status(400).json({ error: "No data received." });
      }

      let addresses = [];
      try {
        addresses = req.body.addresses ? JSON.parse(req.body.addresses) : [];
      } catch (error) {
        return res.status(400).json({ error: "Invalid addresses format." });
      }

      const updatedData = { ...req.body, addresses };
      const result = await TraineeService.updateTrainee(traineeId, updatedData, req.files);
      return res.status(200).json({
        message: "Trainee updated successfully",
        updatedTrainee: result,
      });

    } catch (error) {
      console.error("Error Updating Trainee:", error.message);
      return res.status(500).json({ error: error.message });
    }
  });
};

exports.getTraineeById = async (req, res) => {
  try {
    const traineeId = req.params.traineeId;
    const trainee = await TraineeService.getTraineeById(traineeId);
    return res.status(200).json({
      message: "Trainee retrieved successfully",
      trainee,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
