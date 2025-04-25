const DesignationService = require("../service/designationService");
  

exports.addDesignation = async (req, res) => {
    try {
  
      //Calling  Service Layer for Validation & saving 
      const response = await DesignationService.createDesignation(req.body);
  
      // Send Success Response
      return res.status(201).json(response);
    } catch (error) {
      console.error("Error Adding designation:", error.message);
      return res.status(500).json({ error: "Failed to add designation. " + error.message });
    }
};

exports.getAllDesignations = async (req, res) => {
    try {
      const designations = await DesignationService.fetchDesignations();
      return res.status(200).json(designations);
    } catch (error) {
      return res.status(500).json({ error: "Fetching designations failed: " + error.message });
    }
};