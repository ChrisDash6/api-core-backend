const express = require("express");
const router = express.Router();
const leavesController = require("../controllers/leavesController");
const verifySession = require("../middlewares/authenticationMiddleware");

router.post("/:empId", verifySession, leavesController.saveLeave);
router.put("/:leaveId", verifySession, leavesController.updateLeave);
router.get("/:empId", verifySession, leavesController.getAllLeaves);

module.exports = router;