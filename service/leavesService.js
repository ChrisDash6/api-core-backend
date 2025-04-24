const Leaves = require("../models/leaves");

exports.getAllLeaves = async (traineeId) => {
  const leaves = await Leaves.find({ traineeId: traineeId });
  return leaves;
};

exports.createLeave = async (leaveData) => {
  const newLeave = new Leaves(leaveData);
  return await newLeave.save();
};

exports.updateLeave = async (leaveId, updatedData) => {
  try {
    const existingLeave = await Leaves.findById(leaveId);

    if (!existingLeave) {
      throw new Error("Leave not found");
    }

    const updateFields = {};
    Object.keys(updatedData).forEach((key) => {
      if (
        updatedData[key] !== undefined &&
        updatedData[key] !== existingLeave[key]
      ) {
        updateFields[key] = updatedData[key];
      }
    });

    const updatedLeave = await Leaves.findByIdAndUpdate(
      leaveId,
      { $set: updateFields },
      { new: true }
    );

    return updatedLeave;
  } catch (error) {
    throw new Error(error.message);
  }
};
