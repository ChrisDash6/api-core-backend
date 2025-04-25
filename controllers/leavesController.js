const leavesService = require("../service/leavesService");

exports.saveLeave = async (req, res) => {
  try {
    const { empId } = req.params;
    const leaveData = { ...req.body, empId };
    const newLeave = await leavesService.createLeave(leaveData);
    return res.status(201).json(newLeave);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

exports.updateLeave = async (req, res) => {
  try {
    const { leaveId } = req.params;
    const updatedLeave = await leavesService.updateLeave(leaveId, req.body);

    if (!updatedLeave) {
      return res.status(404).json({ message: "Leave not found" });
    }
    return res.status(200).json(updatedLeave);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

exports.getAllLeaves = async (req, res) => {
  try {
    const { empId } = req.params;
    const userLeaves = await leavesService.getAllLeaves(empId);
    return res.status(200).json(userLeaves);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};