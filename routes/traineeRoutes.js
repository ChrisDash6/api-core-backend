const express = require("express");
const router = express.Router();
const TraineeController = require("../controllers/traineeController");
const verifySession = require("../middlewares/authenticationMiddleware");
const upload = require("../middlewares/fileStorageMiddlware");

// trainee creation route
router.post("/traineeAdd", verifySession, TraineeController.addTrainee);
router.get("/trainees", verifySession, TraineeController.getAllTrainees);
router.put("/:traineeId", verifySession, TraineeController.updateTrainee);
router.get("/:traineeId", verifySession, TraineeController.getTraineeById);

module.exports = router;
