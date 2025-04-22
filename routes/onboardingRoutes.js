const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });

const OnboardingController = require("../controllers/onboardingController");
const verifySession = require("../middlewares/authenticationMiddleware");

router.post("/submit/:empId", verifySession, OnboardingController.submitOnboarding);
router.get("/onboardingRequests", verifySession, OnboardingController.getAllOnboardingRequests);


module.exports = router;
